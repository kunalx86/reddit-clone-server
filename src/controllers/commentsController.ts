import { Comment } from "@entities/Comment";
import { CommentVote } from "@entities/CommentVote";
import { Post } from "@entities/Post";
import { User } from "@entities/User";
import { LoadStrategy } from "@mikro-orm/core";
import { ICommentPostRequest, IVoteCommentRequest } from "@shared/types";
import { Response, Request } from "express";

export const createComment = async (req: ICommentPostRequest, res: Response) => {
  const { em } = req;
  const postId = parseInt(req.params.postId);
  if (!req.body.comment.length || req.body.comment.length > 150) {
    return res.status(400).send({
      errors: {
        comment: "Comment cannot exceed 150 characters/It is also required field"
      }
    })
  }
  const post = await em.findOneOrFail(Post, {
    id: postId
  });
  const user = await User.getUser(req.session.userId || -1);
  const comment = new Comment(req.body.comment);
  comment.user = user;
  comment.post = post;
  if (req.body.parent) {
    const parent = await em.findOneOrFail(Comment, {
      id: req.body.parent
    });
    comment.parent = parent;
  }
  await em.persistAndFlush(comment);
  res.status(201).send({
    data: {
      ...comment,
    }
  });
}

export const getComments = async (req: Request, res: Response) => {
  const { em } = req;
  const postId = parseInt(req.params.postId);
  const comments = await em.find(Comment, {
    post: postId,
    parent: null
  }, {
    populate: ['replies', 'votes', 'user.profile', 'replies.user', 'replies.user.profile', 'replies.votes'],
    orderBy: {
      createdAt:'asc'
    },
    strategy: LoadStrategy.JOINED
  });
  // Has to be inside because of req object
  const mapCommentVotes = (comment: Comment) => {
    const replies = comment.replies.getItems().map(reply => ({
      ...reply,
      parent: undefined,
      votes: undefined,
      voted: reply.getHasVoted(req.session.userId || -1)
    }))
    return {
      ...comment,
      replies: replies,
      votes: undefined,
      voted: comment.getHasVoted(req.session.userId || -1),
    }
  }
  const data = comments.map(mapCommentVotes);
  res.status(200).send({ data })
}

export const voteComment = async (req: IVoteCommentRequest, res: Response) => {
  const { em } = req;
  const commentId = parseInt(req.params.commentId);
  const vote = req.body.vote >= 1 && ! (req.body.vote < -1) ? 1 : -1;

  const comment = await em.findOneOrFail(Comment, {
    id: commentId,
  }, {
    populate: ['votes'],
    strategy: LoadStrategy.JOINED
  });
  const commentVote = await em.findOne(CommentVote, {
    comment,
    user: req.session.userId
  });
  if (commentVote) {
    if (vote === commentVote.vote) {
      comment.votes.remove(commentVote);
      vote === 1 ? comment.votesCount-- : comment.votesCount++;
      await em.removeAndFlush(commentVote);
    }
    else {
      commentVote.vote = vote;
      vote === 1 ? comment.votesCount++ : comment.votesCount--;
      await em.persistAndFlush(commentVote);
    }
    await em.persistAndFlush(comment)
  }
  else {
    const user = await User.getUser(req.session.userId || -1);
    const newCommentVote = new CommentVote(vote);
    newCommentVote.user = user;
    newCommentVote.comment = comment;
    comment.votes.add(newCommentVote);
    comment.votesCount += vote;
    await em.persistAndFlush([comment, newCommentVote]);
  }
  const data = {
    ...comment,
    voted: comment.getHasVoted(req.session.userId || -1)
  }
  res.status(201).send({ data });
}