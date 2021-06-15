import { Comment } from "@entities/Comment";
import { FollowGroup } from "@entities/FollowGroup";
import { FollowUser } from "@entities/FollowUser";
import { Post } from "@entities/Post";
import { User } from "@entities/User";
import { LoadStrategy, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Request, Response } from "express";


export const getUserController = async (req: Request, res: Response) => {
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

export const getUserPostsController = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const username = req.params.username;

  const [ user, currUser ] = await Promise.all([
    em.findOneOrFail(User, {
      username
    }),
    em.findOne(User, {
      id: req.session.userId
    })
  ]);
  const posts = await em.find(Post, {
    author: user
  }, {
    populate: ['votes', 'group', 'media'],
    strategy: LoadStrategy.JOINED
  })

  let data = {}

  if (currUser) {
    data = posts.map(post => {
      const { vote: voteCount } = post.votes.toArray().reduce((acc, curr) => ({vote: acc.vote + curr.vote}), { vote: 0 });
      const [hasVoted] = post.votes.toArray().filter(vote => {
        if (vote.user instanceof User)
          return vote.user.id === req.session.userId
        return vote.user === req.session.userId
      })
      return {
        ...post,
        votes: voteCount,
        voted: hasVoted?.vote
      }
    })
  }
  else data = posts;
  
  res.status(200).send({ data });
}

export const getUserCommentsController = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const username = req.params.username;

  const [ user, currUser ] = await Promise.all([
    em.findOneOrFail(User, {
      username
    }),
    em.findOne(User, {
      id: req.session.userId
    })
  ]);
  const comments = await em.find(Comment, {
    user
  }, {
    populate: ['votes'],
    strategy: LoadStrategy.JOINED
  })

  let data = {}

  if (currUser) {
    data = comments.map(comment => {
      const { vote: voteCount } = comment.votes.toArray().reduce((acc, curr) => ({vote: acc.vote + curr.vote}), { vote: 0 });
      const [hasVoted] = comment.votes.toArray().filter(vote => {
        if (vote.user instanceof User)
          return vote.user.id === req.session.userId
        return vote.user === req.session.userId
      })
      return {
        ...comment,
        votes: voteCount,
        voted: hasVoted?.vote
      }
    })
  }
  else data = comments;
  
  res.status(200).send({ data });
}