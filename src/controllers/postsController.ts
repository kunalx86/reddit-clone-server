import { Comment } from "@entities/Comment";
import { Group } from "@entities/Group";
import { Media, MediaType } from "@entities/Media";
import { Post } from "@entities/Post";
import { PostVote } from "@entities/PostVote";
import { User } from "@entities/User";
import { LoadStrategy, QueryFlag, QueryOrderMap, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { PAGE_SIZE } from "@shared/constants";
import { IPostCreateRequest, IVotePostRequest } from "@shared/types";
import { generateOrderByClause } from "@utils/clauseGenerator";
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
      vote === 1 ? post.votesCount-- : post.votesCount++;
      await em.removeAndFlush(postVote);
    }
    else {
      postVote.vote = vote;
      vote === 1 ? post.votesCount++ : post.votesCount--;
      await em.persistAndFlush(postVote);
    }
    await em.persistAndFlush(post)
  }
  else {
    const user = await User.getUser(req.session.userId || -1);
    const newPostVote = new PostVote(vote);
    newPostVote.post = post;
    newPostVote.user = user;
    post.votes.add(newPostVote);
    post.votesCount += vote;
    await em.persistAndFlush([newPostVote, post]);
  }
  const data = {
    ...post,
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
    voted: post.getHasVoted(req.session.userId || -1),
    comments: post.comments.length
  }
  res.status(200).send({ data })
}

/*
* User authentication is optional
* If user is authenticated then
* 1. Get posts authored by the users authenticated user follows
* 2. Get posts posted in group that the authenticated user follows
* Else
* 1. Get most voted posts?
* Sort By
* 1. upvoted
* 2. downvoted
* 3. latest
* Example URL: /api/posts?page=2&sortBy=upvoted
*/
export const getPosts = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const { page, sortBy } = req.query;
  const user = await em.findOne(User, {
    id: req.session.userId
  }, {
    populate: ['followingUsers', 'followingUsers.following', 'followingUsers.following.profile', 'followingGroups'],
    strategy: LoadStrategy.JOINED
  })
  const [ posts, count ] = await em.findAndCount(Post, user ? {
    $or: [
      {
        author: {
          $in: user.getFollowing().map(user => user.id)
        }
      },
      {
        group: {
          $in: user.followingGroups.getItems().map(group => group.group)
        }
      }
    ]
  } : { }, {
    populate: ['media', 'author', 'author.profile', 'group'],
    strategy: LoadStrategy.JOINED,
    limit: PAGE_SIZE,
    offset: parseInt(page as string) * PAGE_SIZE,
    orderBy: generateOrderByClause(sortBy as string),
    flags: [QueryFlag.DISTINCT]
  })

  // Necessary because joining 1:N in above query messes up with pagination
  const [ commentCount, _ ] = await Promise.all([
    em.count(Comment, {
      post: {
        $in: posts.map(post => post.id)
      }
    }),
    Promise.all(posts.map(post => post.votes.init()))
  ])
  const data = posts.map(post => ({
    ...post,
    voted: post.getHasVoted(req.session.userId || -1),
    votes: undefined,
    comments: commentCount
  }))
  res.status(200).send({
    data: {
      posts: data,
      hasMore: !((parseInt(page as string)+1) * PAGE_SIZE >= count),
      count
    }
  })
}