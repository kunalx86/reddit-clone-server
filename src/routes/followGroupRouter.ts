import { followGroupController } from "@controllers/followGroupController";
import { verifyAuth } from "@middlewares/verifyAuth";
import { Router } from "express";

const router = Router();

router.route("/follow/:groupId")
  .post(verifyAuth, followGroupController);

export default router;