import { FollowGroup } from "@entities/FollowGroup";
import { Group } from "@entities/Group";
import { User } from "@entities/User";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Request, Response } from "express";

export const followGroupController = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const groupId = parseInt(req.params.groupId);

  const group = await em.findOne(Group, {
    id: groupId
  });

  if (!group) {
    throw new Error("No such group");
  }

  const ifExists = await em.findOne(FollowGroup, {
    group: groupId,
    user: req.session.userId,
  });

  if (ifExists) {
    throw new Error("You already follow the group");
  }

  const followGroup = new FollowGroup()
  followGroup.user = await User.getUser(req.session.userId || -1);
  followGroup.group = group;

  await em.persistAndFlush(followGroup);

  res.status(201).send({
    message: `You are now following group ${group.name}`
  });
}