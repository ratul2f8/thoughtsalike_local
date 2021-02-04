import { Flex, Button } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import EachPostCard from "../../components/EachPost";
import PostLoaderSkeleton from "../../components/PostLoadingSkeleton";
import  WithNavBar from "../../components/WithNavBar";
import { usePostsQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import Router from "next/router";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
const limit = 15;
const PostsPage: NextPage<{ afterFrom: string }> = ({ afterFrom }) => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      after: afterFrom,
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
        ) : (
          <>
            {data?.posts.map((post, index) =>
              index < limit ? <EachPostCard key={post.id} post={post} /> : null
            )}
            <Flex justifyContent="center" alignContent="center">
              <Button leftIcon={<ChevronLeftIcon />}
               colorScheme="blue"
               marginTop="15px"
               marginRight="10px"
               onClick={() =>
                 Router.back()
               }
              >
                Previous
              </Button>
              {data?.posts.length > limit && (
                <Button
                  rightIcon={<ChevronRightIcon />}
                  colorScheme="purple"
                  marginTop="15px"
                  onClick={() =>
                    Router.push(
                      `/posts/${data.posts[data.posts.length - 1].id}`
                    )
                  }>
                  Next
                </Button>
              )}
            </Flex>
          </>
        )}
      </Flex>
    </WithNavBar>
  );
};
PostsPage.getInitialProps = ({ query }) => {
  return {
    afterFrom: query.afterFrom as string,
  };
};
export default withUrqlClient(createUrqlClient)(PostsPage);
