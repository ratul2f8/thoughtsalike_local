import { Divider, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { withUrqlClient } from "next-urql";
import React from "react";
import {
  RegularPostFragment,
  useFindUserByIdQuery,
} from "../generated/graphql";
import { Markup } from "interweave";
import { createUrqlClient } from "../utils/createUrqlClient";
import GeekWidget from "./GeekWidget";
interface IProps {
  post: RegularPostFragment;
}
const EachPostView: React.FC<IProps> = ({ post }) => {
  const [{ data: postUser }] = useFindUserByIdQuery({
    variables: { id: post.creatorId + "" },
  });
  return (
    <Stack
      className="applyHiddenScrollbar"
      spacing="2"
      height="100%"
      width="100vw"
      padding="20px"
      justifyContent="flex-start"
      alignItems="flex-start">
      <Text paddingTop="20px" fontSize="200%">
        {post.title}
      </Text>
      <span style={{ fontSize: "100%", fontWeight: 400 }}>
        &nbsp; by{" "}
        <b>
          {postUser?.findUserById
            ? postUser?.findUserById?.username
            : "Anonymous"}
        </b>
      </span>
      <span style={{ fontSize: "100%", fontWeight: 400 }}>
        &nbsp; posted: <b>{moment(Number(post.createdAt)).fromNow()}</b>
      </span>
      {Number(post.createdAt) === Number(post.updatedAt) ? null : (
        <span style={{ fontSize: "100%", fontWeight: 400 }}>
          &nbsp; updated: <b>{moment(Number(post.updatedAt)).fromNow()}</b>
        </span>
      )}
      <GeekWidget post={post} />
      <Divider />
      <Text fontSize="120%" lineHeight="2" alignSelf="center" align="left">
        <>
          <Markup content={post.text} />
        </>
      </Text>
    </Stack>
  );
};
export default withUrqlClient(createUrqlClient)(EachPostView);
