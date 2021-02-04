import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { MyContext } from "src/types";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { PostCreationResponse } from "../utils/FieldError";
import { Updoot } from "../entities/Updoot";

@ObjectType()
class VoteResponse {
  @Field(() => Int)
  points?: number;

  @Field(() => String)
  error?: string;

  @Field(() => Int)
  voteStatus: number
}

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(
    @Root()
    root: Post
  ) {
    return root.text.length >= 150
      ? root.text.slice(0, 150) + "..."
      : root.text;
  }

  @Query(() => [Post])
  async posts(
    @Arg("limit", () => Int)
    limit: number,

    // @Arg("cursor", () => String, { nullable: true })
    // cursor: string | null,

    @Arg("after", () => String, { nullable: true })
    after: string,

    @Ctx()
    { req: {session: {userId}}}: MyContext
  ): Promise<Post[]> {
    const realLimit = Math.min(20, limit) + 1;
    const posts = await getConnection().query(`
       select p.*,
       json_build_object(
         'id',u.id,
         'username',u.username,
         'email',u.email,
         'createdAt', u."createdAt",
         'updatedAt', u."updatedAt"
       ) creator,
       ${userId ? `(select value from updoot where "userId" = ${userId} and "postId" = p.id) as "voteStatus"`
       : '0 as "voteStatus"'
      }
       from post p
       inner join public.user u on u.id = p."creatorId"
       ${after? `where p.id <= ${parseInt(after)}`: ""}
       order by p.id DESC
       limit ${realLimit}
    `)
    return posts;
  }

  @Query(() => [Post])
  @UseMiddleware(isAuthenticated)
  async votedPosts(
    @Arg("id", () => Int)
    id: number,
    @Arg("value", () => Int)
    value: number
  ): Promise<Post[]> {

    const posts = await getConnection().query(`
       select post.*,
       json_build_object(
        'id',u.id,
        'username',u.username,
        'email',u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
      ) creator,
       ${value} as "voteStatus"
       from updoot, post
       inner join public.user u on u.id = post."creatorId"
       where (updoot."postId" = post.id) and (updoot.value = ${value}) and(updoot."userId" = ${id})
       order by post.id DESC
    `)
    return posts;
  }

  @Query(() => [Post])
  @UseMiddleware(isAuthenticated)
  async composedPosts(
    @Ctx()
    {req}: MyContext
  ): Promise<Post[]> {

    const posts = await getConnection().query(`
       select p.*,
       json_build_object(
        'id',u.id,
        'username',u.username,
        'email',u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
      ) creator
       from post p
       inner join public.user u on u.id = p."creatorId"
       where p."creatorId" = ${req.session.userId}
       order by p.id DESC
    `)
    console.log(posts);
    return posts;
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int)
    id: number
  ): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => PostCreationResponse)
  @UseMiddleware(isAuthenticated)
  async createPost(
    @Arg("options")
    options: PostInput,
    @Ctx()
    { req }: MyContext
  ): Promise<PostCreationResponse> {
    try {
      const response = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Post)
        .values({
          ...options,
          creatorId: req.session.userId,
        })
        .returning("*")
        .execute();
      const post = response.raw[0];
      return { post };
    } catch (err) {
      return {
        error: {
          field: "internal",
          message: err.message,
        },
      };
    }
  }


  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id",() => Int)
    id: number,
    @Arg("title", { nullable: true })
    title: string,
    @Arg("text", {nullable: true})
    text: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    if (!post) {
      return undefined;
    }
    if (typeof title !== "undefined" || typeof text !== "undefined") {
      await Post.update({ id }, { title, text });
    }
    const updatedPost = await Post.findOne(id);
    return updatedPost;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deletePost(
    @Arg("postId", () => Int)
    postId: number,

    @Ctx()
    {req :{session: {userId}}}: MyContext
  ):Promise<boolean>{
    try{
      await getConnection().query(`
      START TRANSACTION;
      delete from updoot where "postId" = ${postId};
      delete from post where id = ${postId} and "creatorId" = ${userId};
      COMMIT;
      `)
      return true;
    }catch{
      return false;
    }
  }

  @Mutation(() => VoteResponse)
  @UseMiddleware(isAuthenticated)
  async vote(
    @Arg("postId", () => Int)
    postId: number,
    @Arg("value", () => Int)
    value: number,
    @Ctx()
    {
      req: {
        session: { userId },
      },
    }: MyContext
  ): Promise<VoteResponse> {
    try {
      const realValue = value <= 0 ? -1 : 1;
      const updoot = await Updoot.findOne({ where: { postId, userId } });
      if (updoot) {
        //TO DO
        if (realValue === updoot.value) {
          await getConnection().query(`
      START TRANSACTION;
      update post
      set points = points - ${updoot.value}
      where post.id = ${postId};

      delete from updoot
      where ("postId" = ${updoot.postId}) and ("userId" = ${updoot.userId});

      COMMIT;
      `);
        } else {
          await getConnection().query(`
      START TRANSACTION;
      update post
      set points = points - ${updoot.value} + ${realValue}
      where post.id = ${postId};

      update updoot
      set value = ${realValue}
      where ("postId" = ${updoot.postId}) and ("userId" = ${updoot.userId});

      COMMIT;
      `);
        }
      } else {
        await getConnection().query(`
    START TRANSACTION;
    insert into updoot("userId", "postId", value)
    values(${userId},${postId},${realValue});
    update post
    set points = points + ${realValue}
    where post.id = ${postId};
    COMMIT;
    `);
      }
      const updatedObject = await Post.findOne(postId);
      return {
        points: updatedObject?.points,
        error: "",
        voteStatus: updoot ? updoot.value === realValue ? 0 : realValue : realValue,
      };
    } catch (err) {
      return {
        error: err.message,
        voteStatus: 0,
      };
    }
  }
}
