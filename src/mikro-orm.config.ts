// import "./pre-start";
import { Configuration, IDatabaseDriver, Connection, Options } from "@mikro-orm/core";
import { __prod__ } from "@shared/constants";
import { entities } from "./entities";
import path from "path";

export default {
  dbName: process.env.DB_NAME,
  type: 'postgresql',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  clientUrl: process.env.DB_URL,
  entities, 
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  discovery: {
    tsConfigPath: "../tsconfig.json",
  },
  debug: !__prod__,
  tsNode: !__prod__,
  autoJoinOneToOneOwner: true,
} as Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> | undefined;