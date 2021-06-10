import { groupUpload } from "@controllers/multerController";
import { verifyAuth } from "@middlewares/verifyAuth";
import { verifyGroupPermission } from "@middlewares/verifyGroupPermission";
import { Router } from "express";

const router = Router();

router.route('/:groupId/pictures')
  .post(verifyAuth, verifyGroupPermission, groupUpload.fields([{
    name: 'profilePicture',
    maxCount: 1,
  }, {
    name: 'bgProfilePicture',
    maxCount: 1,
  }]), (_, res) => {
    res.status(201).send({
      message: "Picture(s) created"
    });
  });

export default router;
