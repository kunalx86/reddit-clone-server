import { FollowGroup } from "@entities/FollowGroup";
import { Group } from "@entities/Group";
import { User } from "@entities/User";
import { IPostCreateRequest } from "@shared/types";
import { NextFunction, Request, Response } from "express";

export const verifyGroupPermission = async (req: Request, res: Response, next: NextFunction) => {
  const { em } = req;
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

export const postCreatePermission = async (req: IPostCreateRequest, res: Response, next: NextFunction) => {
  const { em } = req;
  if (!req.body.group) {
    next();
  }
  else {
    const groupId = req.body.group;
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
    if (group.owner === user || ifFollow?.user === user) next();
    else return next(new Error("You are not allowed to perform the operation"));
  }
}