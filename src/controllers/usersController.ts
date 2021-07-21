import { Comment } from "@entities/Comment";
import { FollowGroup } from "@entities/FollowGroup";
import { FollowUser } from "@entities/FollowUser";
import { Post } from "@entities/Post";
import { User } from "@entities/User";
import { LoadStrategy, QueryFlag, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { PAGE_SIZE } from "@shared/constants";
import { Request, Response } from "express";


export const getUser = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const username = req.params.username;

  const [ user, currUser ] = await Promise.all([
    em.findOneOrFail(User, {
      username
    }, {
      populate: ['profile'],
      strategy: LoadStrategy.JOINED,
    }),
    em.findOne(User, {
      id: req.session.userId
    })
  ])
  const [ followers, following, followingGroups, posts, comments ] = await Promise.all([
    em.count(FollowUser, {
      following: user
    }),
    em.count(FollowUser, {
      followedBy: user
    }),
    em.count(FollowGroup, {
      user
    }),
    em.count(Post, {
      author: user
    }),
    em.count(Comment, {
      user
    })
  ]);

  let isFollowing = false;
  if (currUser) {
    isFollowing = !!await em.findOne(FollowUser, {
      followedBy: currUser,
      following: user
    });
  }

  res.status(200).send({
    data: {
      user,
      followers,
      following,
      followingGroups,
      posts,
      comments,
      isFollowing
    }
  });
}

export const getUserPosts = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const username = req.params.username;
  const { page } = req.query;

  const [ user ] = await Promise.all([
    em.findOneOrFail(User, {
      username
    })
  ]);
  const [ posts, count ] = await em.findAndCount(Post, {
    author: user
  }, {
    populate: ['group', 'media'],
    strategy: LoadStrategy.JOINED,
    limit: PAGE_SIZE,
    offset: parseInt(page as string) * PAGE_SIZE,
    orderBy: {
      createdAt: 'desc'
    },
    flags: [QueryFlag.DISTINCT] 
  })
  await Promise.all(posts.map(post => post.votes.init()))
  const data = posts.map(post => ({
    ...post,
    voted: post.getHasVoted(req.session.userId || -1),
    votes: undefined  
  }));
  
  res.status(200).send({ 
    data: {
      posts: data,
      hasMore: !((parseInt(page as string)+1) * PAGE_SIZE >= count),
      count
    }
  });
}

export const getUserComments = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const username = req.params.username;

  const [ user ] = await Promise.all([
    em.findOneOrFail(User, {
      username
    })
  ]);
  const comments = await em.find(Comment, {
    user
  }, {
    populate: ['votes'],
    strategy: LoadStrategy.JOINED
  })
  
  const data = comments.map(comment => ({
    ...comment,
    voted: comment.getHasVoted(req.session.userId || -1) 
  }))
  res.status(200).send({ data });
}