import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import  Container  from "../../components/Container";
import EachPostView from "../../components/EachPostView";
import PostLoaderSkeleton from "../../components/PostLoadingSkeleton";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
const PostView: NextPage<{ id: number }> = ({ id }) => {
  const [{ data: postQuery, fetching: loading }] = usePostQuery({
    variables: { id },
  });
  return (
    <Container backButton={true} pageTitle="Read" height="100vh">
       <Flex flexDirection="column" justifyContent="center" alignItems="center"
        padding="20px"
        height="100%"
        width="100vw"
       >
       {loading ? (
        <PostLoaderSkeleton/>
      ) : <>
      {
          postQuery?.post
          ?
          (
            <EachPostView post={postQuery?.post}/>
          )
          :
          "Post doesn't exist!!"
      }
      
      </>}
       </Flex>
    </Container>
  );
};
PostView.getInitialProps = ({ query }) => {
  return {
    id: +query.id,
  };
};
export default withUrqlClient(createUrqlClient)(PostView);
