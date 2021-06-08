import { Request, Response } from "express"
import { User } from "@entities/User";
import { FollowUser } from "@entities/FollowUser";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";

export const followController = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const followId = parseInt(req.params.userId);
  
  const ifExists = await em.findOne(FollowUser, {
    followedBy: req.session.userId,
    following: followId,
  })
  
  if (ifExists) {
    res.send({
      message: "You are already following user"
    });
  }
  
  const currUser = await User.getUser(req.session.userId || 0);
  const followUser = await User.getUser(followId);
  const newFollow = new FollowUser()
  newFollow.following = followUser;
  newFollow.followedBy = currUser;
  await em.persistAndFlush(newFollow);

  res.status(201).send({
    message: `You are now following user ${followUser.username}`
  });
}

export const getFollowersController = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const followers = await em.find(User, {
    id: req.session.userId,
  }, ['followedByUsers', 'followedByUsers.followedBy', 'followedByUsers.followedBy.profile']);

  res.status(200).send({
    data: followers.map(follower => follower.followedByUsers)
  });
}

export const getFollowingController = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const followers = await em.find(User, {
    id: req.session.userId,
  }, ['followingUsers', 'followingUsers.following', 'followingUsers.following.profile']);

  res.status(200).send({
    data: followers.map(follower => follower.followingUsers)
  })
}