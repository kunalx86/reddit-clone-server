import { User } from "@entities/User";
import { v2 as cloudinary } from "cloudinary";
// const cloudinary = require("cloudinary");
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { IUserRegisterRequest } from "@shared/types";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import fs from "fs";
import { UserProfile } from "@entities/UserProfile";
import { GroupProfile } from "@entities/GroupProfile";
import { Group } from "@entities/Group";

const userStorageCloudinary = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const em = RequestContext.getEntityManager() as EntityManager;
    const userProfile = await em.findOneOrFail(UserProfile, {
      user: req.session.userId
    }, {
      populate: ['user']
    });
    const dir = `users/${userProfile.user.id}`;
    let public_id = "";
    if (file.fieldname === 'profilePicture')
      public_id = `${userProfile.user.username}_profile${file.originalname.split('.')[1]}`
    else if (file.fieldname === 'bgProfilePicture')
      public_id = `${userProfile.user.username}_bg${file.originalname.split('.')[1]}`
    return {
      folder: dir,
      public_id,
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [{width: 500, height: 500}]
    }
  }
})

const userStorageLocal = multer.diskStorage({
  destination: async (req, file, cb) => {
    const em = RequestContext.getEntityManager() as EntityManager;
    const userProfile = await em.findOneOrFail(UserProfile, {
      user: req.session.userId
    }, {
      populate: ['user']
    });
    const dir = `${__dirname}/../../static/images/users/${userProfile.user.id}`;
    if (file.fieldname === 'profilePicture')
      userProfile.profilePicture = `${dir}/${userProfile.user.username}_profile.${file.originalname.split('.')[1]}`;
    else if (file.fieldname === 'bgProfilePicture')
      userProfile.bgProfilePicture = `${dir}/${userProfile.user.username}_bg.${file.originalname.split('.')[1]}`;
    else 
      cb(new Error("Field in user upload not recognized"), "");
    await em.persistAndFlush(userProfile);
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, err => {
        cb(err, dir);
      });
    }
    cb(null, dir);
  },
  filename: async (req: IUserRegisterRequest, file, cb) => {
    const em = RequestContext.getEntityManager() as EntityManager;
    const user = await em.findOneOrFail(User, {
      id: req.session.userId
    });
    if (file.fieldname === 'profilePicture')
      cb(null, `${user.username}_profile.${file.originalname.split('.')[1]}`);
    else if (file.fieldname === 'bgProfilePicture')
      cb(null, `${user.username}_bg.${file.originalname.split('.')[1]}`);
    else
      cb(new Error("Field in user upload not recognized"), "");
  }
});

export const userUpload = multer({
  storage: userStorageCloudinary,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      cb(null, true);
    else
      cb(new Error("Only image type is allowed"));
  }
});

const groupStorageCloudinary = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const em = RequestContext.getEntityManager() as EntityManager;
    const groupId = parseInt(req.params.groupId);
    const groupProfile = await em.findOneOrFail(GroupProfile, {
      group: groupId
    }, {
      populate: ['group']
    });
    const dir = `groups/${groupProfile.group.id}`;
    let public_id = "";
    if (file.fieldname === 'profilePicture')
      public_id = `${groupProfile.group.name}_profile${file.originalname.split('.')[1]}`
    else if (file.fieldname === 'bgProfilePicture')
      public_id = `${groupProfile.group.name}_bg${file.originalname.split('.')[1]}`
    return {
      folder: dir,
      public_id,
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [{width: 500, height: 500}]
    }
  }
})

const groupStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const em = RequestContext.getEntityManager() as EntityManager;
    const groupId = parseInt(req.params.groupId);
    const groupProfile = await em.findOneOrFail(GroupProfile, {
      group: groupId
    }, {
      populate: ['group']
    });
    const dir = `${__dirname}/../../static/images/groups/${groupProfile.group.id}`;
    if (file.fieldname === 'profilePicture')
      groupProfile.profilePicture = `${dir}/${groupProfile.group.name}_profile.${file.originalname.split('.')[1]}`;
    else if (file.fieldname === 'bgProfilePicture')
      groupProfile.bgProfilePicture = `${dir}/${groupProfile.group.name}_bg.${file.originalname.split('.')[1]}`;
    else 
      cb(new Error("Field in group upload not recognized"), "");
    await em.persistAndFlush(groupProfile);
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, err => {
        cb(err, dir);
      });
    }
    cb(null, dir);
  },
  filename: async (req, file, cb) => {
    const em = RequestContext.getEntityManager() as EntityManager;
    const groupId = parseInt(req.params.groupId);
    const group = await em.findOneOrFail(Group, {
      id: groupId
    });
    if (file.fieldname === 'profilePicture')
      cb(null, `${group.name}_profile.${file.originalname.split('.')[1]}`);
    else if (file.fieldname === 'bgProfilePicture')
      cb(null, `${group.name}_bg.${file.originalname.split('.')[1]}`);
    else
      cb(new Error("Field in group upload not recognized"), "");
  }
});

export const groupUpload = multer({
  storage: groupStorageCloudinary,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      cb(null, true);
    else
      cb(new Error("Only image type is allowed"));
  }
});