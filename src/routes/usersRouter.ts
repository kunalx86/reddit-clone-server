import { followUser, getFollowersController, getFollowingController } from "@controllers/followUserController";
import { userUpload } from "@controllers/multerController";
import { getUserComments, getUser, getUserPosts } from "@controllers/usersController";
import { UserProfile } from "@entities/UserProfile";
import { verifyAuth } from "@middlewares/verifyAuth";
import { RequestContext, EntityManager } from "@mikro-orm/core";
import { Router } from "express";

const router = Router();

router.route("/follow/:userId")
.post(verifyAuth, followUser);

router.route("/followers")
.get(verifyAuth, getFollowersController);

router.route("/following")
.get(verifyAuth, getFollowingController);

router.route("/profile")
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

router.route("/:username")
  .get(getUser);

router.route("/:username/posts")
  .get(getUserPosts);

router.route("/:username/comments")
  .get(getUserComments);

export default router;