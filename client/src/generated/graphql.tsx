import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  posts: Array<Post>;
  votedPosts: Array<Post>;
  composedPosts: Array<Post>;
  post?: Maybe<Post>;
  me?: Maybe<User>;
  findUserById?: Maybe<User>;
};


export type QueryPostsArgs = {
  after?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryVotedPostsArgs = {
  value: Scalars['Int'];
  id: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryFindUserByIdArgs = {
  id: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Int'];
  title: Scalars['String'];
  text: Scalars['String'];
  points: Scalars['Int'];
  creatorId: Scalars['Int'];
  creator: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  voteStatus?: Maybe<Scalars['Int']>;
  textSnippet: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: PostCreationResponse;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  vote: VoteResponse;
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationCreatePostArgs = {
  options: PostInput;
};


export type MutationUpdatePostArgs = {
  text?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['Int'];
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  options: LogInObject;
};

export type PostCreationResponse = {
  __typename?: 'PostCreationResponse';
  error?: Maybe<FieldError>;
  post?: Maybe<Post>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type VoteResponse = {
  __typename?: 'VoteResponse';
  points: Scalars['Int'];
  error: Scalars['String'];
  voteStatus: Scalars['Int'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type LogInObject = {
  identifier: Scalars['String'];
  password: Scalars['String'];
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularPostFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'text' | 'points' | 'creatorId' | 'createdAt' | 'updatedAt' | 'voteStatus'>
);

export type RegularPostsFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'textSnippet' | 'points' | 'creatorId' | 'createdAt' | 'updatedAt' | 'voteStatus'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type RegularVoteResponseFragment = (
  { __typename?: 'VoteResponse' }
  & Pick<VoteResponse, 'error' | 'points' | 'voteStatus'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'PostCreationResponse' }
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & RegularPostFragment
    )>, error?: Maybe<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )> }
  ) }
);

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  identifier: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'Post' }
    & RegularPostFragment
  )> }
);

export type VoteMutationVariables = Exact<{
  postId: Scalars['Int'];
  value: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & { vote: (
    { __typename?: 'VoteResponse' }
    & Pick<VoteResponse, 'points' | 'error' | 'voteStatus'>
  ) }
);

export type ComposedPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type ComposedPostsQuery = (
  { __typename?: 'Query' }
  & { composedPosts: Array<(
    { __typename?: 'Post' }
    & RegularPostsFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & RegularPostFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: Array<(
    { __typename?: 'Post' }
    & RegularPostsFragment
  )> }
);

export type FindUserByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type FindUserByIdQuery = (
  { __typename?: 'Query' }
  & { findUserById?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email'>
  )> }
);

export type VotedPostsQueryVariables = Exact<{
  value: Scalars['Int'];
  id: Scalars['Int'];
}>;


export type VotedPostsQuery = (
  { __typename?: 'Query' }
  & { votedPosts: Array<(
    { __typename?: 'Post' }
    & RegularPostsFragment
  )> }
);

export const RegularPostFragmentDoc = gql`
    fragment RegularPost on Post {
  id
  title
  text
  points
  creatorId
  createdAt
  updatedAt
  voteStatus
}
    `;
export const RegularPostsFragmentDoc = gql`
    fragment RegularPosts on Post {
  id
  title
  textSnippet
  points
  creatorId
  createdAt
  updatedAt
  voteStatus
  creator {
    id
    username
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
  createdAt
  updatedAt
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const RegularVoteResponseFragmentDoc = gql`
    fragment RegularVoteResponse on VoteResponse {
  error
  points
  voteStatus
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!, $text: String!) {
  createPost(options: {title: $title, text: $text}) {
    post {
      ...RegularPost
    }
    error {
      ...RegularError
    }
  }
}
    ${RegularPostFragmentDoc}
${RegularErrorFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($postId: Int!) {
  deletePost(postId: $postId)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($identifier: String!, $password: String!) {
  login(options: {identifier: $identifier, password: $password}) {
    user {
      ...RegularUser
    }
    errors {
      ...RegularError
    }
  }
}
    ${RegularUserFragmentDoc}
${RegularErrorFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $email: String!) {
  register(options: {username: $username, password: $password, email: $email}) {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $text: String!) {
  updatePost(id: $id, title: $title, text: $text) {
    ...RegularPost
  }
}
    ${RegularPostFragmentDoc}`;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($postId: Int!, $value: Int!) {
  vote(postId: $postId, value: $value) {
    points
    error
    voteStatus
  }
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const ComposedPostsDocument = gql`
    query ComposedPosts {
  composedPosts {
    ...RegularPosts
  }
}
    ${RegularPostsFragmentDoc}`;

export function useComposedPostsQuery(options: Omit<Urql.UseQueryArgs<ComposedPostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ComposedPostsQuery>({ query: ComposedPostsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    ...RegularPost
  }
}
    ${RegularPostFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $after: String) {
  posts(limit: $limit, after: $after) {
    ...RegularPosts
  }
}
    ${RegularPostsFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const FindUserByIdDocument = gql`
    query FindUserById($id: String!) {
  findUserById(id: $id) {
    id
    username
    email
  }
}
    `;

export function useFindUserByIdQuery(options: Omit<Urql.UseQueryArgs<FindUserByIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FindUserByIdQuery>({ query: FindUserByIdDocument, ...options });
};
export const VotedPostsDocument = gql`
    query VotedPosts($value: Int!, $id: Int!) {
  votedPosts(value: $value, id: $id) {
    ...RegularPosts
  }
}
    ${RegularPostsFragmentDoc}`;

export function useVotedPostsQuery(options: Omit<Urql.UseQueryArgs<VotedPostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<VotedPostsQuery>({ query: VotedPostsDocument, ...options });
};