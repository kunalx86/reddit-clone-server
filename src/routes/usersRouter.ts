import { getUserCommentsController, getUserController, getUserPostsController } from "@controllers/usersController";
import { Router } from "express";

const router = Router();

router.route("/:username")
  .get(getUserController);

router.route("/:username/posts")
  .get(getUserPostsController);

router.route("/:username/comments")
  .get(getUserCommentsController);

export default router;