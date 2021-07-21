import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { UserProfile } from "@entities/UserProfile";
import { GroupProfile } from "@entities/GroupProfile";
import { Post } from "@entities/Post";

const userStorageCloudinary = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { em } = req;
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
  cloudinary,
  params: async (req, file) => {
    const { em } = req;
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

export const groupUpload = multer({
  storage: groupStorageCloudinary,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      cb(null, true);
    else
      cb(new Error("Only image type is allowed"));
  }
});

const postStorageCloudinary = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { em } = req;
    const postId = parseInt(req.params.postId);
    const post = await em.findOneOrFail(Post, {
      id: postId
    });
    const dir = `posts/${post.id}`;
    const public_id = `${post.id}.${file.originalname.split(".")[1]}`
    return {
      folder: dir,
      public_id,
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
      transformation: [{width: 500, height: 500}]
    }
  }
})

export const postUpload = multer({
  storage: postStorageCloudinary,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      cb(null, true);
    else
      cb(new Error("Only image type is allowed"));
  }
});