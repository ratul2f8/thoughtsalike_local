import "reflect-metadata";
import { MyContext } from "./types";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import express from "express";
import { PostResolver } from "./resolvers/posts";
import { UserResolver } from "./resolvers/users";
//redis
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import { COOKIE_NAME, __prod__ } from "./constants";
import { User } from "./entities/User";
import path from "path"
import { Updoot } from "./entities/Updoot";
//import { sendEmail } from "./utils/sendEmail";
const RedisStore = connectRedis(session);
const redis = new Redis();
const PORT = 4000;
const main = async () => {
  //const ormConnection = 
  await createConnection({
    type: "postgres",
    database: "thoughtsalike",
    username: "hr",
    password: "0000",
    logging: true,
    synchronize: true,
    entities: [Post, User, Updoot],
    migrations: [path.join(__dirname,"./migrations/*")]
  });
  
  //await Post.delete({});
  //await ormConnection.runMigrations();
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  //redis configuration
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 3600 * 24 * 365 * 7, // 7 years
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax", //csrf
      },
      saveUninitialized: false,
      secret: "hello world!!",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.get("/", (_, res) => {
    res.send("Hello World");
  });
  app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
  });
  // const post = orm.em.create(Post, {title: 'My First Post!'});
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};
main().catch((err) => console.error(err));
