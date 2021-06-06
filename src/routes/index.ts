import { User } from "@entities/User";
import { verifyAuth } from "@middlewares/verifyAuth";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/knex";
import { Request, Response, Router } from "express";
import authRouter from "./authRouter";

// Export the base-router
const baseRouter = Router();
baseRouter.get('/', (_, res) => {
  res.json({
    message: "This is the Reddit Clone API",
  });
})

baseRouter.get('/whoami', verifyAuth, async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const user = await em.createQueryBuilder(User).select(["username", "id"]).where({
    id: req.session.userId
  }).getSingleResult();
  res.status(200).send({
    data: user,
  });
})

baseRouter.use("/auth", authRouter);

export default baseRouter;
