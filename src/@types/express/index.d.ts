import "express";
import { EntityManager, AbstractSqlDriver, AbstractSqlConnection } from "@mikro-orm/postgresql";

declare global {
  namespace Express {
    interface Request {
      em: EntityManager<AbstractSqlDriver<AbstractSqlConnection>>
    }
  }
}