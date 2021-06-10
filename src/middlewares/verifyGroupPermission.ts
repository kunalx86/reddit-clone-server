import { FollowGroup } from "@entities/FollowGroup";
import { Group } from "@entities/Group";
import { User } from "@entities/User";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { NextFunction, Request, Response } from "express";

export const verifyGroupPermission = async (req: Request, res: Response, next: NextFunction) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const groupId = parseInt(req.params.groupId);
  const group = await em.findOneOrFail(Group, {
    id: groupId
  });
  const user = await em.findOne(User, {
    id: req.session.userId
  });
  const ifFollow = await em.findOne(FollowGroup, {
    group,
    user
  })
  if (group.owner === user || ifFollow?.moderator) next();
  else return next(new Error("You are not allowed to perform the operation"));
}