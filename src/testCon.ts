import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "salzkid24",
    database: "test",
    logging: true,
    synchronize: drop,
    dropSchema: drop,
    entities: ["./entity/User.ts"],
  });
};
