import { userUpload } from "@controllers/multerController";
import { UserProfile } from "@entities/UserProfile";
import { verifyAuth } from "@middlewares/verifyAuth";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Router } from "express";

const router = Router();

router.route("/")
  .post(verifyAuth, userUpload.fields([{
    name: 'profilePicture',
    maxCount: 1
  }, {
    name: 'bgProfilePicture',
    maxCount: 1
  }]), async (req, res) => {
    const em = RequestContext.getEntityManager() as EntityManager;
    const userProfile = await em.findOneOrFail(UserProfile, {
      user: req.session.userId
    });
    // @ts-ignore
    const profileFile = req.files['profilePicture'];
    if (profileFile) {
      // @ts-ignore
      userProfile?.profilePicture = profileFile[0].path as string;
    }
    // @ts-ignore
    const bgProfileFile = req.files['bgProfilePicture'];
    if (bgProfileFile) {
      // @ts-ignore
      userProfile?.bgProfilePicture = bgProfileFile[0].path as string;
    }
    await em.persistAndFlush(userProfile);
    res.status(201).send({
      message: "Picture(s) updated"
    })
  });

export default router;