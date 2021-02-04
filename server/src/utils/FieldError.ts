import { User } from "../entities/User";
import {
  Field,
  ObjectType
} from "type-graphql";
import { Post } from "../entities/Post";


@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
@ObjectType()
export class PostCreationResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;

  @Field(() => Post, { nullable: true })
  post?: Post|{textSnippet?: string};
}

