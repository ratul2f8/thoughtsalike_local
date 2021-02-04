import {
  ArrowForwardIcon,
  SettingsIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Stack,
  useColorMode,
  Text,
  Divider,
  Flex,
  ButtonGroup,
  IconButton,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import Router from "next/router";
import React from "react";
import {
  RegularPostsFragment,
  useMeQuery,
} from "../generated/graphql";
import GeekWidget from "./GeekWidget";

interface IPost {
  post: RegularPostsFragment;
}

const EachPostCard: React.FC<IPost> = ({ post }) => {
  const { colorMode } = useColorMode();
  const [{ data }] = useMeQuery();

  const bgColor = { light: "gray.50", dark: "#17202A" };

  const color = { light: "black", dark: "white" };
  return (
    <Box
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
      marginTop="10px"
      marginBottom="10px"
      borderRadius="8px"
      width="90vw"
      maxWidth="1400px"
      height="auto"
      padding="2em">
      <Stack spacing={4}>
        <Text fontSize="180%" fontWeight={400}>
          {post.title}
        </Text>
        <span style={{ fontSize: "110%", fontWeight: 400 }}>
          by{" "}
          <b>
            {post.creatorId === data?.me?.id ? "Me" : post.creator.username}
          </b>
        </span>
        {/* <Flex justifyContent="flex-start" alignItems="center">
          <Text fontWeight="bold" fontSize="200%">
            {post.points}
            &nbsp;
            <span style={{ fontSize: "50%", fontWeight: 400 }}>geeks</span>
          </Text>
          <ButtonGroup
            isAttached
            isDisabled={!data?.me || data?.me?.id === post.creatorId}
            marginLeft="auto">
            <Tooltip label="Thumbs Up" hasArrow>
              <IconButton aria-label="up" icon={<TriangleUpIcon />} />
            </Tooltip>
            <Tooltip label="Thumbs Down" hasArrow>
              <IconButton aria-label="down" icon={<TriangleDownIcon />} />
            </Tooltip>
          </ButtonGroup>
        </Flex> */}
        <GeekWidget post={post}/>
        <Divider />
        <Text fontSize="110%">{post.textSnippet}</Text>
        <br />
        <Flex justifyContent="center" alignItems="center">
          {data?.me?.id === post.creatorId ? (
            <Button rightIcon={<SettingsIcon />} colorScheme="twitter"
            onClick={() => Router.push(`/manage/${post.id}`)}
            >
              Manage Post
            </Button>
          ) : (
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="facebook"
              variant="solid"
              onClick={() => Router.push(`/view/${post.id}`)}>
              Read post
            </Button>
          )}
        </Flex>
      </Stack>
    </Box>
  );
};
export default EachPostCard;
