import { Comment } from "@entities/Comment";
import { FollowGroup } from "@entities/FollowGroup";
import { FollowUser } from "@entities/FollowUser";
import { Post } from "@entities/Post";
import { User } from "@entities/User";
import { LoadStrategy, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
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

  const [ user ] = await Promise.all([
    em.findOneOrFail(User, {
      username
    })
  ]);
  const posts = await em.find(Post, {
    author: user
  }, {
    populate: ['votes', 'group', 'media'],
    strategy: LoadStrategy.JOINED
  })

  const data = posts.map(post => ({
    ...post,
    votes: post.getVotes(),
    voted: post.getHasVoted(req.session.userId || -1)
  }));
  
  res.status(200).send({ data });
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
    votes: comment.getVotes(),
    voted: comment.getHasVoted(req.session.userId || -1) 
  }))
  res.status(200).send({ data });
}