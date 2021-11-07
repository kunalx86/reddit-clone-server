import { Group } from "@entities/Group";
import { GroupProfile } from "@entities/GroupProfile";
import { Post } from "@entities/Post";
import { Comment } from "@entities/Comment";
import { Rule } from "@entities/Rule";
import { User } from "@entities/User";
import { LoadStrategy, QueryFlag } from "@mikro-orm/core";
import { FORBIDDEN_GROUPNAMES, PAGE_SIZE } from "@shared/constants";
import { IGroupRequest, IRulesPostRequest } from "@shared/types";
import { generateOrderByClause } from "@utils/clauseGenerator";
import { errorVerifier, groupValidator } from "@utils/groupValidator";
import { Response, Request } from "express";
import { ValidationError } from "yup";

export const createGroup = async (req: IGroupRequest, res: Response) => {
  const { em } = req;

  try {
    await groupValidator(req.body);
  } catch(err) {
    if (err instanceof ValidationError) {
      const errors = errorVerifier(err);
      return res.status(400).send({errors});
    }
  }

  const isGroup = await em.findOne(Group, {
    name: req.body.name
  });

  if (isGroup) {
    throw new Error(`Group ${req.body.name} already exists`);
  }

  if (FORBIDDEN_GROUPNAMES.includes(req.body.name)) {
    return res.status(400).send({
      error: `${req.body.name} is not a valid group name`
    });
  }

  const currUser = await User.getUser(req.session.userId || -1);
  const group = new Group(req.body.name);
  const groupProfile = new GroupProfile("default_profile_pic", "default_bg_profile");
  group.owner = currUser;
  groupProfile.bio = req.body.bio;
  group.profile = groupProfile;

  await em.persistAndFlush(group);
  res.status(201).send({
    data: group
  });
}

export const getGroupPosts = async (req: Request, res: Response) => {
  const { em } = req;
  const groupName = req.params.groupName
  const { page, sortBy } = req.query;
  const [ posts, count ] = await em.findAndCount(Post, {
    group: {
      name: groupName
    }
  }, {
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

export const addRules = async (req: IRulesPostRequest, res: Response) => {
  const { em } = req;
  const rules: Rule[] = req.body.rules.map(rule => new Rule(rule.rule))
  const group = await em.findOneOrFail(Group, {
    id: parseInt(req.params.groupId)
  }, {
    populate: ['profile', 'profile.rules'],
    strategy: LoadStrategy.JOINED
  });
  rules.forEach(rule => {
    rule.group = group.profile;
    group.profile.rules.add(rule);
  })
  await em.persistAndFlush([...rules, group.profile])
  res.send({
    data: {
      group
    }
  })
}

export const deleteRule = async (req: Request, res: Response) => {
  const { em } = req;
  const ruleId = parseInt(req.params.ruleId);
  const groupId = parseInt(req.params.groupId);
  const rule = await em.findOneOrFail(Rule, {
    id: ruleId,
    group: groupId // To be extra safe
  });
  await em.removeAndFlush(rule);
  res.status(204).send({
    data: rule
  });
}

export const getRules = async (req: Request, res: Response) => {
  const { em } = req;
  const groupId = parseInt(req.params.groupId);

  const rules = await em.find(Rule, {
    group: groupId
  });

  res.send({
    data: rules
  });
}