import express from "express";
import { loginUser, logoutUser, registerUser } from "@controllers/authController";
import { verifyAuth } from "@middlewares/verifyAuth";

const router = express.Router();

router.route('/register')
  .post(registerUser);

router.route('/login')
  .post(loginUser);

router.route('/logout')
  .post(verifyAuth, logoutUser);

export default router;