import { Group } from "@entities/Group";
import { Media, MediaType } from "@entities/Media";
import { Post } from "@entities/Post";
import { User } from "@entities/User";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { IPostCreateRequest } from "@shared/types";
import { errorVerifier, validatePost } from "@utils/postValidator";
import { Response } from "express";

export const createPostController = async (req: IPostCreateRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  try {
    await validatePost(req.body);
  } catch(err) {
    const errors = errorVerifier(err);
    return res.status(400).send({ errors });
  }
  if (req.body.media.type !== MediaType.TEXT) {
    if (req.body.media.text) throw new Error("Cannot set text when media type is not text");
  }
  else {
    if (req.body.media.text!.length! < 2 || req.body.media.text!.length! > 150) {
      throw new Error("Post should be between 2 and 150 characters");
    }
  }
  const isGroup = !!req.body.group;
  const post = new Post(req.body.title);
  const media = new Media(req.body.media.type);
  if (isGroup) {
    const group = await em.findOneOrFail(Group, {
      id: req.body.group
    });
    post.group = group;
  } 
  const user = await em.findOneOrFail(User, {
    id: req.session.userId
  });
  post.author = user;
  media.mediaText = req.body.media.text ?? "";
  post.media = media;
  await em.persistAndFlush([post, media]);
  res.status(201).send({
    data: {
      post,
      media: post.media,
    } 
  });
}