import { withUrqlClient } from "next-urql";
import React from "react";
import {
  RegularPostFragment,
  useDeletePostMutation,
  useFindUserByIdQuery,
  useMeQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  Divider,
  Flex,
  Text,
  Stack,
  ButtonGroup,
  IconButton,
  Tooltip,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
  Textarea,
} from "@chakra-ui/react";
import moment from "moment";
import PostLoaderSkeleton from "./PostLoadingSkeleton";
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Router from "next/router";
import { ProgressPage } from "./ProgressPage";
import { useUpdatePostMutation } from "../generated/graphql";
import { Markup } from "interweave";
interface IProps {
  post: RegularPostFragment;
}
const ManagePostView: React.FC<IProps> = ({ post }) => {
  const [, deletePost] = useDeletePostMutation();
  const [operating, setOperating] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<RegularPostFragment>(post);
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };
  const [, updatePost] = useUpdatePostMutation();
  const [{ data, fetching }] = useMeQuery();
  const [actions, setActions] = React.useState<{
    editing: boolean;
    deleting: boolean;
  }>({
    editing: false,
    deleting: false,
  });
  const toggleEditView = () => {
    setFormData(post);
    setActions({ editing: !actions.editing, deleting: false });
  };
  const handleSubmission = async () => {
    setOperating(true);
    try {
      await updatePost({
        text: formData.text,
        title: formData.title,
        id: post.id,
      });
      setOperating(false);
      toggleEditView();
    } catch (err) {
      setOperating(false);
      toggleEditView();
    }
  };
  const handleDeletion = async (postId: number) => {
    setActions({ editing: false, deleting: !actions.deleting });
    setOperating(true);
    const response = await deletePost({ postId });
    if (response.data?.deletePost === true) {
      setOperating(false);
      Router.push("/");
    } else {
      setOperating(false);
      setActions({ editing: false, deleting: !actions.deleting });
    }
  };
  const toggleDeleteView = () =>
    setActions({ editing: false, deleting: !actions.deleting });
  const DeletionConfimation = () => {
    return (
      <Modal
        closeOnOverlayClick={false}
        isOpen={!!actions.deleting}
        onClose={toggleDeleteView}>
        <ModalOverlay />
        <ModalContent bg={bgColor[colorMode]} color={color[colorMode]}>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>Are you sure want to delete the post?</ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleDeletion(post.id)}>
              Yes, Remove
            </Button>
            <Button onClick={toggleDeleteView}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  if (operating) {
    return <ProgressPage />;
  }
  return (
    <>
      {fetching ? (
        <PostLoaderSkeleton />
      ) : post?.creatorId !== data?.me?.id ? (
        "Not authenticated to redirect to this page :("
      ) : (
        <Stack
          bg={bgColor[colorMode]}
          color={color[colorMode]}
          className="applyHiddenScrollbar"
          spacing="2"
          width="100vw"
          padding="20px"
          height="100%"
          justifyContent="flex-start"
          alignItems="flex-start">
          {!actions.editing ? (
            <ButtonGroup>
              <Tooltip label="edit" hasArrow>
                <Button
                  aria-label="edit"
                  colorScheme="blue"
                  isDisabled={actions.editing}
                  onClick={toggleEditView}
                  leftIcon={<EditIcon />}>
                  Edit
                </Button>
              </Tooltip>
              <Tooltip label="delete" hasArrow>
                <Button
                  aria-label="edit"
                  colorScheme="red"
                  isDisabled={actions.editing}
                  onClick={toggleDeleteView}
                  leftIcon={<DeleteIcon />}>
                  Remove
                </Button>
              </Tooltip>
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <Tooltip label="finish editing" hasArrow>
                <Button
                  aria-label="finish"
                  colorScheme="blue"
                  onClick={handleSubmission}
                  isDisabled={
                    !actions.editing ||
                    formData.text.trim().length === 0 ||
                    formData.title.trim().length === 0
                  }
                  leftIcon={<CheckIcon />}>
                  Done
                </Button>
              </Tooltip>
              <Tooltip label="Dismiss" hasArrow>
                <Button
                  aria-label="Dismiss"
                  colorScheme="red"
                  isDisabled={!actions.editing}
                  onClick={toggleEditView}
                  leftIcon={<CloseIcon />}>
                  Cancel
                </Button>
              </Tooltip>
            </ButtonGroup>
          )}
          {!actions.editing ? (
            <Text paddingTop="20px" fontSize="200%">
              {post.title}
            </Text>
          ) : (
            <Textarea
              paddingTop="20px"
              fontSize="180%"
              fontWeight="bold"
              border="2px solid whitesmoke"
              value={formData.title}
              name="title"
              onChange={(event) =>
                setFormData({ ...formData, title: event.target.value })
              }
            />
          )}

          {!actions.editing && (
            <>
              <span style={{ fontSize: "100%", fontWeight: 400 }}>
                posted: <b>{moment(Number(post.createdAt)).fromNow()}</b>
              </span>
              {Number(post.createdAt) === Number(post.updatedAt) ? null : (
                <span style={{ fontSize: "100%", fontWeight: 400 }}>
                  updated: <b>{moment(Number(post.updatedAt)).fromNow()}</b>
                </span>
              )}
            </>
          )}

          {!actions.editing && <Divider />}
          {actions.editing ? (
            <Textarea
              fontSize="120%"
              lineHeight="2"
              alignSelf="left"
              align="left"
              value={formData.text}
              name="text"
              rows={10}
              border="2px solid whitesmoke"
              onChange={(event) =>
                setFormData({ ...formData, text: event.target.value })
              }
            />
          ) : (
            <Text
              fontSize="120%"
              lineHeight="2"
              alignSelf="center"
              align="left">
              <>
                <Markup content={post.text} />
              </>
            </Text>
          )}
          <DeletionConfimation />
        </Stack>
      )}
    </>
  );
};
export default withUrqlClient(createUrqlClient)(ManagePostView);
