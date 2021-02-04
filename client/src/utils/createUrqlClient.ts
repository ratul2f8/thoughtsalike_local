import { dedupExchange, fetchExchange, ssrExchange } from "urql";
import { cacheExchange, Cache } from "@urql/exchange-graphcache";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  RegularVoteResponseFragment,
  UpdatePostMutationVariables,
  RegularPostFragment,
  RegularPostsFragment
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import gql from 'graphql-tag';
function invalidateAllPosts(cache: Cache) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "posts", fi.arguments || {});
  });
}
function invalidateVotedPosts(cache: Cache) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "votedPosts");
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "votedPosts", fi.arguments || {});
  });
}

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          vote: (result, args, cache, info) => {
            const { points, voteStatus } = result.vote as RegularVoteResponseFragment;
            const { postId } = args as VoteMutationVariables;
            cache.writeFragment(
              gql`
               fragment __ on Post{
                 id
                 points
                 voteStatus
               }
              `,
              {id: postId, points, voteStatus}
            );
            invalidateVotedPosts(cache)
          },
          updatePost: (result, args, cache, info) => {
            const { updatedAt, text, title} = result.updatePost as RegularPostFragment;
            const { id } = args as UpdatePostMutationVariables;
            cache.writeFragment(
              gql`
               fragment __ on Post{
                 id
                 updatedAt
                 text
                 title
                 textSnippet
               }
              `,
              {id, updatedAt, text, title, textSnippet: text.length >= 150
                ? text.slice(0, 150) + "..."
                :text}
            )
          },
          createPost: (_result, args, cache, info) => {
            invalidateAllPosts(cache);
          },
          deletePost: (_result, args, cache, info) => {
            invalidateAllPosts(cache);
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
