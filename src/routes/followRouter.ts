import { followController, getFollowersController, getFollowingController } from "@controllers/followController";
import { verifyAuth } from "@middlewares/verifyAuth";
import express from "express";

const router = express.Router();

router.route("/follow/:userId")
  .post(verifyAuth, followController);

router.route("/followers")
  .get(verifyAuth, getFollowersController);

router.route("/following")
  .get(verifyAuth, getFollowingController);

export default router;