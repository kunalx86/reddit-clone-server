import { createCommentController, getCommentsController, voteCommentController } from "@controllers/commentController";
import { verifyAuth } from "@middlewares/verifyAuth";
import { Router } from "express";

const router = Router();

router.route("/:postId")
  .post(verifyAuth, createCommentController)
  .get(verifyAuth, getCommentsController);

router.route("/:commentId/vote")
  .post(verifyAuth, voteCommentController);

export default router;