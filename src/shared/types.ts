import { Request } from "express";
import { MediaType } from "@entities/Media";

export interface IUser {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  bio?: string;
}

export interface IUserRegisterRequest extends Request {
  body: IUser;
}

export interface IUserLogin {
  usernameOrEmail: string;
  password: string;
}

export interface IUserLoginRequest extends Request {
  body:IUserLogin;
}

export interface IGroup {
  name: string;
  bio: string;
}

export interface IGroupRequest extends Request {
  body: IGroup;
}

export interface IPost {
  title: string;
  group?: number;
  media: {
    type: MediaType;
    text?: string;
  }
}

export interface IPostCreateRequest extends Request {
  body: IPost;
}