import { createComment, getComments, voteComment } from "@controllers/commentsController";
import { verifyAuth } from "@middlewares/verifyAuth";
import { Router } from "express";

const router = Router();

router.route("/:postId")
  .post(verifyAuth, createComment)
  .get(verifyAuth, getComments);

router.route("/:commentId/vote")
  .post(verifyAuth, voteComment);

export default router;