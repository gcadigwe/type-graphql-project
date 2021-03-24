import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { LoginResolver } from "./modules/user/Login";

const RedisStore = connectRedis(session);

const main = async () => {
  await createConnection();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [RegisterResolver, LoginResolver],
    }),
    context: ({ req }: any) => ({ req }),
  });

  app.use(
    cors({
      credentials: true,
      origin: "https://localhost:3000",
    })
  );

  // const sessionOption: session.SessionOptions = {
  //   store: new RedisStore({
  //     client: redis as any,
  //   }),
  //   name: "qid",
  //   secret: "sarzy",
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
  //   },
  // };

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "halala",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("app is running on port 4000");
  });
};

main();
