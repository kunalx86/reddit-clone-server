import { Comment } from "@entities/Comment";
import { CommentVote } from "@entities/CommentVote";
import { Post } from "@entities/Post";
import { User } from "@entities/User";
import { LoadStrategy, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { ICommentPostRequest, IVoteCommentRequest } from "@shared/types";
import { Response, Request } from "express";

export const createCommentController = async (req: ICommentPostRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
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
    data: comment
  });
}

export const getCommentsController = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const postId = parseInt(req.params.postId);
  const comments = await em.find(Comment, {
    post: postId,
    parent: null
  }, {
    populate: ['replies', 'votes', 'user', 'replies.user', 'replies.votes'],
    orderBy: {
      createdAt:'asc'
    },
    strategy: LoadStrategy.JOINED
  });
  // Has to be inside because of req object
  const mapCommentVotes = (comment: Comment) => {
    const { vote:voteCount } = comment.votes.toArray().reduce((acc, curr) => ({vote: acc.vote + curr.vote}), { vote: 0 });
    const [ hasVoted ] = comment.votes.toArray().filter(vote => {
      if (vote.user instanceof User)
        return vote.user.id === req.session.userId
      return vote.user === req.session.userId
    });
    const replies = comment.replies.toArray().map(reply => {
      const { vote:voteCountR } = reply.votes.reduce((acc: { vote: number }, curr: { vote:number }) => ({vote: acc.vote + curr.vote}), { vote: 0 });
      const [ hasVotedR ] = reply.votes.filter((vote: CommentVote) => vote.user.id === req.session.userId);
      return {
        ...reply,
        votes: voteCountR,
        voted: hasVotedR?.vote
      }
    });
    return {
      ...comment,
      replies: replies,
      votes: voteCount,
      voted: hasVoted?.vote,
    }
  }
  const data = comments.map(mapCommentVotes);
  res.status(200).send({ data })
}

export const voteCommentController = async (req: IVoteCommentRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
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
      em.removeAndFlush(commentVote);
    }
    else {
      commentVote.vote = vote;
      em.persistAndFlush(commentVote);
    }
  }
  else {
    const user = await User.getUser(req.session.userId || -1);
    const newCommentVote = new CommentVote(vote);
    newCommentVote.user = user;
    newCommentVote.comment = comment;
    comment.votes.add(newCommentVote);
    await em.persistAndFlush([comment, newCommentVote]);
  }
  const { vote:voteCount } = comment.votes.toArray().reduce((acc, curr) => ({vote: acc.vote + curr.vote}), { vote: 0 });
  const [ hasVoted ] = comment.votes.toArray().filter(vote => {
    if (vote.user instanceof User)
      return vote.user.id === req.session.userId
    return vote.user === req.session.userId
  });
  const data = {
    comment: {
      ...comment,
      votes: voteCount,
      voted: hasVoted?.vote
    }
  }
  res.status(201).send({ data });
}