import { Group } from "@entities/Group";
import { GroupProfile } from "@entities/GroupProfile";
import { User } from "@entities/User";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { IGroupRequest } from "@shared/types";
import { errorVerifier, groupValidator } from "@utils/groupValidator";
import { Response } from "express";

export const createGroupController = async (req: IGroupRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;

  try {
    await groupValidator(req.body);
  } catch(err) {
    const errors = errorVerifier(err);
    return res.status(400).send({errors});
  }

  const isGroup = await em.findOne(Group, {
    name: req.body.name
  });

  if (isGroup) {
    throw new Error(`Group ${req.body.name} already exists`);
  }

  const currUser = await User.getUser(req.session.userId || -1);
  const group = new Group(req.body.name);
  const groupProfile = new GroupProfile("default_profile_pic", "default_bg_profile");
  group.owner = currUser;
  groupProfile.bio = req.body.bio;
  group.profile = groupProfile;

  await em.persistAndFlush(group);
  res.status(201).send({
    data: group
  });
}