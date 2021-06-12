import { MediaType } from "@entities/Media";
import { Post } from "@entities/Post";
import { LoadStrategy, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { NextFunction, Response, Request } from "express";

export const verifyAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const postId = parseInt(req.params.postId);
  const post = await em.findOneOrFail(Post, {
    id: postId
  }, { 
    populate :['author'],
    strategy: LoadStrategy.JOINED
  });
  if (post.author.id === req.session.userId) next()
  else return next(new Error("You are not allowed to do this"));
}

export const verifyImageUpload = async (req: Request, res: Response, next: NextFunction) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const postId = parseInt(req.params.postId);
  const post = await em.findOneOrFail(Post, {
    id: postId
  }, {
    populate: ['media'],
    strategy: LoadStrategy.JOINED
  });
  if (post.media.type === MediaType.TEXT) return next(new Error("Cannot upload image for this post"));
  else next();
}