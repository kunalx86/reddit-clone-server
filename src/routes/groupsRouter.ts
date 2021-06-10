import { verifyAuth } from "@middlewares/verifyAuth";
import { createGroupController } from "@controllers/groupController";
import { Router } from "express";
import { groupUpload } from "@controllers/multerController";

const router = Router();

router.route('/create')
  .post(verifyAuth, createGroupController);


export default router;