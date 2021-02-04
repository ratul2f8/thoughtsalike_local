import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { Flex, ButtonGroup, Tooltip, IconButton, Text, Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import {
  RegularPostFragment,
  RegularPostsFragment,
  useMeQuery,
  useVoteMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface IProps {
  post: RegularPostFragment | RegularPostsFragment;
}
enum VoteType{
  Up,
  Down
}
const GeekWidget: React.FC<IProps> = ({ post }) => {
  const [{ data }] = useMeQuery();
  const [, vote] = useVoteMutation();
  const [voting, setVoting] = React.useState<{type?: VoteType, loading: boolean}>({loading: false});
  const handleVote = async (type: VoteType) => {
    setVoting({loading: true, type});
    await vote({
      value: type === VoteType.Up ? 1 : -1,
      postId: post.id
    });
    setVoting({type: null, loading: false})
  };
  return (
    <Flex justifyContent="space-between" alignItems="center" width="100%">
      <Text fontWeight="bold" fontSize="200%">
        {post.points}
        &nbsp;
        <span style={{ fontSize: "50%", fontWeight: 400 }}>geeks</span>
        &nbsp;
      </Text>
      <ButtonGroup
        isAttached
        marginLeft="auto">
        <Tooltip label="Thumbs Up" hasArrow>
          <IconButton
            aria-label="up"
            colorScheme={post.voteStatus === 0 ? "blue" : post.voteStatus === 1 ? "green" : "blue"}
            isLoading={voting.loading && voting.type == VoteType.Up}
            onClick={() => handleVote(VoteType.Up)}
            disabled={voting.loading || (!data?.me || data?.me?.id === post.creatorId)}
            icon={<TriangleUpIcon />}
          />
        </Tooltip>
        <Tooltip label="Thumbs Down" hasArrow>
          <IconButton
          colorScheme={post.voteStatus === 0 ? "blue" : post.voteStatus === -1 ? "red" : "blue"}
           onClick={() => handleVote(VoteType.Down)}
            aria-label="down"
            isLoading={voting.loading && voting.type == VoteType.Down}
            disabled={voting.loading || (!data?.me || data?.me?.id === post.creatorId)}
            icon={<TriangleDownIcon />}
          />
        </Tooltip>
      </ButtonGroup>
    </Flex>
  );
};
export default withUrqlClient(createUrqlClient)(GeekWidget);
