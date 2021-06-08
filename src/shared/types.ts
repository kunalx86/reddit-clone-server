import { Request } from "express";

export interface IUser {
  username: string;
  email: string;
  password: string;
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