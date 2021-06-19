import { followGroup } from "@controllers/followGroupController";
import { addRules, createGroup, deleteRule } from "@controllers/groupsController";
import { groupUpload } from "@controllers/multerController";
import { GroupProfile } from "@entities/GroupProfile";
import { verifyAuth } from "@middlewares/verifyAuth";
import { verifyGroupPermission } from "@middlewares/verifyGroupPermission";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Router } from "express";

const router = Router();

router.route('/:groupId/profile')
  .post(verifyAuth, verifyGroupPermission, groupUpload.fields([{
    name: 'profilePicture',
    maxCount: 1,
  }, {
    name: 'bgProfilePicture',
    maxCount: 1,
  }]), async (req, res) => {
    const em = RequestContext.getEntityManager() as EntityManager;
    const groupId = parseInt(req.params.groupId);
    const groupProfile = await em.findOneOrFail(GroupProfile, {
      group: groupId
    });
    // @ts-ignore
    const profileFile = req.files['profilePicture'];
    if (profileFile) {
      // @ts-ignore
      groupProfile?.profilePicture = profileFile[0].path as string;
    }
    // @ts-ignore
    const bgProfileFile = req.files['bgProfilePicture'];
    if (bgProfileFile) {
      // @ts-ignore
      groupProfile?.bgProfilePicture = bgProfileFile[0].path as string;
    }
    await em.persistAndFlush(groupProfile);
    res.status(201).send({
      message: "Picture(s) created"
    });
  });

router.route("/:groupId/rules")
  .post(verifyAuth, verifyGroupPermission, addRules);

router.route("/:groupId/:ruleId")
  .delete(verifyAuth, verifyGroupPermission, deleteRule);

router.route("/follow/:groupId")
  .post(verifyAuth, followGroup);

router.route('/create')
  .post(verifyAuth, createGroup);

export default router;
