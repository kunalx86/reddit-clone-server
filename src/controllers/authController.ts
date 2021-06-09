import { IUserLoginRequest, IUserRegisterRequest } from "@shared/types";
import argon from "argon2";
import { Request, Response } from "express";
import { errorVerifier, registerValidator } from "@utils/registerValidator";
import { User } from "@entities/User";
import { EntityManager } from "@mikro-orm/postgresql";
import { RequestContext } from "@mikro-orm/core";
import { UserProfile } from "@entities/UserProfile";

export const registerController = async (req: IUserRegisterRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  try {
    await registerValidator(req.body);
  } catch(err) {
    const errors = errorVerifier(err);
    return res.status(400).send({errors});
  }
  const usernameUser = await em.findOne(User, {
    username: req.body.username
  });

  if (usernameUser) {
    throw new Error("Username already exists");
  }

  const emailUser = await em.findOne(User, {
    email: req.body.email
  });

  if (emailUser) {
    throw new Error("Email already exists");
  }
  const user = new User(req.body.username, req.body.email)
  const userProfile = new UserProfile("default_profile_pic", "default_bg_pic");
  userProfile.fullName = req.body.fullName || "";
  userProfile.bio = req.body.bio || "";
  // user.generateHashPassword(req.body.password);
  user.hashedPwd = await argon.hash(req.body.password);
  user.profile = userProfile;
  await em.persistAndFlush(user);
  req.session.userId = user.id;
  res.send({
    message: `Registration of ${user.username} was successful`
  })
}

export const loginController = async (req: IUserLoginRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const isEmail = !!req.body.usernameOrEmail.split("@")[1];
  // No need to validate this input as we will not be saving anything to the database
  const user = await em.findOne(User, isEmail ? {
    email: req.body.usernameOrEmail
  } : {
    username: req.body.usernameOrEmail
  });

  if (!user) {
    throw new Error("No such user");
  }

  if (await user.verifyPassword(req.body.password)) {
    req.session.userId = user.id;
    res.status(200).send({
      message: "You have logged in successfully"
    });
  } else {
    res.status(400).send({
      error: "Password is wrong"
    });
  }
}

export const logoutController = (req: Request, res: Response) => {
  req.session.destroy(err => {
    console.error(err);
  });
  res.status(200).send({
    message: "Logged out successfully",
  });
}