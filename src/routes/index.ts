import { User } from "@entities/User";
import { verifyAuth } from "@middlewares/verifyAuth";
import { LoadStrategy } from "@mikro-orm/core";
import { Request, Response, Router } from "express";
import authRouter from "./authRouter";
import groupsRouter from "./groupsRouter";
import postsRouter from "./postsRouter";
import commentsRouter from "./commentsRouter";
import usersRouter from "./usersRouter";
import searchRouter from "./searchRouter";

// Export the base-router
const baseRouter = Router();
baseRouter.get('/', (_, res) => {
  res.json({
    message: "This is the Reddit Clone API",
  });
})

baseRouter.get('/whoami', verifyAuth, async (req: Request, res: Response) => {
  const { em } = req;
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
baseRouter.use("/g", groupsRouter);
baseRouter.use("/u", usersRouter);
baseRouter.use("/search", searchRouter);
baseRouter.use("/posts", postsRouter);
baseRouter.use("/comments", commentsRouter);

export default baseRouter;
