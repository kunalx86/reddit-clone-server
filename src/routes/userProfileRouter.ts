import { userUpload } from "@controllers/multerController";
import { verifyAuth } from "@middlewares/verifyAuth";
import { Router } from "express";

const router = Router();

router.route("/")
  .post(verifyAuth, userUpload.fields([{
    name: 'profilePicture',
    maxCount: 1
  }, {
    name: 'bgProfilePicture',
    maxCount: 1
  }]), (_, res) => {
    res.status(201).send({
      message: "Picture(s) updated"
    })
  });

export default router;