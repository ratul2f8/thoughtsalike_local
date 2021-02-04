import { SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Router from "next/router";
import React from "react";
import { useComposedPostsQuery, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import PostLoaderSkeleton from "./PostLoadingSkeleton";
import { ProgressPage } from "./ProgressPage";
interface IProp {
  id: number;
}
const ComposedPosts: React.FC<IProp> = ({ id }) => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "#17202A" };

  const color = { light: "black", dark: "white" };
  const [{ data: info, fetching: loading }] = useMeQuery();
  const [{ data, fetching: fetchingPosts }] = useComposedPostsQuery();
  React.useEffect(() => {
    console.log(data);
  }, [data, fetchingPosts]);
  if (loading) {
    return <ProgressPage />;
  }
  return (
    <>
      {info?.me?.id !== id ? (
        "You are not authenticated to redirect to this page :("
      ) : (
        <>
          {fetchingPosts ? (
            <PostLoaderSkeleton />
          ) : data?.composedPosts.length !== 0 ? (
            <>
              {data.composedPosts.map((post) => (
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
                      by <b>{post.creator.username}</b>
                    </span>
                    <Divider />
                    <Text fontSize="110%">{post.textSnippet}</Text>
                    <br />
                    <Flex justifyContent="center" alignItems="center">
                      <Button
                        rightIcon={<SettingsIcon />}
                        colorScheme="facebook"
                        variant="solid"
                        onClick={() => Router.push(`/manage/${post.id}`)}>
                        Manage post
                      </Button>
                    </Flex>
                  </Stack>
                </Box>
              ))}
            </>
          ) : (
            <Text fontWeight="bold" fontSize="150%">
              You haven't composed any posts yet!!
            </Text>
          )}
        </>
      )}
    </>
  );
};
export default withUrqlClient(createUrqlClient)(ComposedPosts);
