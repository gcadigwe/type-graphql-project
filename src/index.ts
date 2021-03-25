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
import { MeResolver } from "./modules/user/Me";

const main = async () => {
  await createConnection();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [RegisterResolver, LoginResolver, MeResolver],
      // authChecker: ({ context: { req } }) => {
      //   // here we can read the user from context
      //   // and check his permission in the db against the `roles` argument
      //   // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
      //   if (req.session.userId) {
      //     return true;
      //   }
      //   return false; // or false if access is denied
      // },
    }),
    context: ({ req }: any) => ({ req }),
  });

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "https://localhost:3000",
    })
  );

  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis as any,
    }),
    name: "qid",
    secret: "sarzy",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    },
  };

  app.use(session(sessionOption));

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("app is running on port 4000");
  });
};

main();
