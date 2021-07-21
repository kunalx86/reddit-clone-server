import { Group } from "@entities/Group";
import { NextFunction, Request, Response } from "express";

export const verifyGroupExistsId = async (req: Request, res: Response, next: NextFunction) => {
  const { em } = req;
  const groupId = parseInt(req.params.groupId);

  const group = await em.findOne(Group, {
    id: groupId
  });

  if (!group) {
    return next(new Error(`${groupId} no such group`))
  }
  next();
}

export const verifyGroupExistsName = async (req: Request, res: Response, next: NextFunction) => {
  const { em } = req;
  const groupName = req.params.groupName;

  const group = await em.findOne(Group, {
    name: groupName
  });

  if (!group) {
    return next(new Error(`${groupName} no such group`))
  }
  next();
}