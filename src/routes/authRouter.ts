import express from "express";
import { loginController, logoutController, registerController } from "@controllers/authController";
import { verifyAuth } from "@middlewares/verifyAuth";

const router = express.Router();

router.route('/register')
  .post(registerController);

router.route('/login')
  .post(loginController);

router.route('/logout')
  .post(verifyAuth, logoutController);

export default router;