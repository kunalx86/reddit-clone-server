import { verifyAuth } from "@middlewares/verifyAuth";
import { createGroupController } from "@controllers/groupController";
import { Router } from "express";

const router = Router();

router.route('/create')
  .post(verifyAuth, createGroupController);

export default router;