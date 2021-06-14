import { User } from "@entities/User";
import { verifyAuth } from "@middlewares/verifyAuth";
import { LoadStrategy, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Request, Response, Router } from "express";
import authRouter from "./authRouter";
import followRouter from "./followUserRouter";
import groupsRouter from "./groupsRouter";
import groupRouter from "./groupRouter";
import followGroupRouter from "./followGroupRouter";
import userProfileRouter from "./userProfileRouter";
import postRouter from "./postRouter";
import commentRouter from "./commentRouter";

// Export the base-router
const baseRouter = Router();
baseRouter.get('/', (_, res) => {
  res.json({
    message: "This is the Reddit Clone API",
  });
})

baseRouter.get('/whoami', verifyAuth, async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const user = await em.findOne(User, {
    id: req.session.userId || -1,
  }, {
    populate: ['profile'],
    strategy: LoadStrategy.JOINED,
  });
  res.status(200).send({
    data: user,
  });
})

baseRouter.use("/auth", authRouter);
baseRouter.use("/users", followRouter);
baseRouter.use("/groups", groupsRouter);
baseRouter.use("/group", groupRouter);
baseRouter.use("/g", followGroupRouter);
baseRouter.use("/profile", userProfileRouter);
baseRouter.use("/post", postRouter);
baseRouter.use("/comments", commentRouter);

export default baseRouter;
