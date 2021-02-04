import { Button, ButtonGroup, Flex, IconButton, Text } from "@chakra-ui/react";
import WithNavBar from "../components/WithNavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import PostLoaderSkeleton from "../components/PostLoadingSkeleton";
import { usePostsQuery } from "../generated/graphql";
import EachPostCard from "../components/EachPost";
import Router from "next/router";
import React from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
const limit = 15;
const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit,
    },
  });
  return (
    <WithNavBar height="100vh" pageTitle="Feeds">
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        lineHeight="6"
        padding="50px">
        {fetching ? (
          <PostLoaderSkeleton />
        ) : data?.posts ? (
          <>
            {data.posts.map((post, index) =>
              index < limit ? <EachPostCard key={post.id} post={post} /> : null
            )}
            {data.posts.length > limit && (
              <Button
                rightIcon={<ChevronRightIcon />}
                colorScheme="purple"
                marginTop="15px"
                onClick={() =>
                  Router.push(`/posts/${data.posts[data.posts.length - 1].id}`)
                }>
                Next
              </Button>
            )}
          </>
        ) : (
          <Text fontWeight="bold" fontSize="150%">
            No posts yet!!
          </Text>
        )}
      </Flex>
    </WithNavBar>
  );
};
export default withUrqlClient(createUrqlClient)(Index);
