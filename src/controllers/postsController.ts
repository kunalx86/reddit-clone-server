import { Group } from "@entities/Group";
import { Media, MediaType } from "@entities/Media";
import { Post } from "@entities/Post";
import { PostVote } from "@entities/PostVote";
import { User } from "@entities/User";
import { LoadStrategy, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { IPostCreateRequest, IVotePostRequest } from "@shared/types";
import { errorVerifier, validatePost } from "@utils/postValidator";
import { Response, Request } from "express";

export const createPost = async (req: IPostCreateRequest, res: Response) => {
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

/*
* If first time create the Vote resource
* After if vote value is same as previous, undo it
* If different then set the new value
*/
export const votePost = async (req: IVotePostRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const postId = parseInt(req.params.postId);
  const vote = req.body.vote >= 1 && ! (req.body.vote < -1) ? 1 : -1;
  const post = await em.findOneOrFail(Post, {
    id: postId
  }, {
    populate: ['votes'],
    strategy: LoadStrategy.JOINED
  });
  const postVote = await em.findOne(PostVote, {
    user: req.session.userId,
    post: post
  });
  if (postVote) {
    if (vote === postVote.vote) {
      post.votes.remove(postVote);
      em.removeAndFlush(postVote);
    }
    else {
      postVote.vote = vote;
      em.persistAndFlush(postVote);
    }
  }
  else {
    const user = await User.getUser(req.session.userId || -1);
    const newPostVote = new PostVote(vote);
    newPostVote.post = post;
    newPostVote.user = user;
    post.votes.add(newPostVote);
    await em.persistAndFlush([newPostVote, post]);
  }
  const data = {
    ...post,
    votes: post.getVotes(),
    voted: post.getHasVoted(req.session.userId || -1)
  }
  res.status(201).send({
    data
  });
}

export const getPost = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const postId = parseInt(req.params.postId);
  const post = await em.findOneOrFail(Post, {
    id: postId,
  }, {
    populate: ['media', 'author', 'votes', 'comments'],
    strategy: LoadStrategy.JOINED
  });
  const data = {
    ...post,
    votes: post.getVotes(),
    voted: post.getHasVoted(req.session.userId || -1),
    comments: post.comments.length
  }
  res.status(200).send({ data })
}