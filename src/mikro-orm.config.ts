// import "./pre-start";
import { Configuration, IDatabaseDriver, Connection, Options } from "@mikro-orm/core";
import { __prod__ } from "@shared/constants";
import path from "path";

export default {
  dbName: 'redditclone',
  type: 'postgresql',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [
    "./dist/entities/*.js"
  ],
  entitiesTs: [
    "./src/entities/*.ts"
  ],
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  discovery: {
    tsConfigPath: "../tsconfig.json",
  },
  debug: !__prod__,
  tsNode: !__prod__,
} as Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> | undefined;