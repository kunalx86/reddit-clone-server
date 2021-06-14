import { Group } from "@entities/Group";
import { GroupProfile } from "@entities/GroupProfile";
import { Rule } from "@entities/Rule";
import { User } from "@entities/User";
import { LoadStrategy, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { IGroupRequest, IRulesPostRequest } from "@shared/types";
import { errorVerifier, groupValidator } from "@utils/groupValidator";
import { Response, Request } from "express";

export const createGroupController = async (req: IGroupRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;

  try {
    await groupValidator(req.body);
  } catch(err) {
    const errors = errorVerifier(err);
    return res.status(400).send({errors});
  }

  const isGroup = await em.findOne(Group, {
    name: req.body.name
  });

  if (isGroup) {
    throw new Error(`Group ${req.body.name} already exists`);
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
export const addRulesController = async (req: IRulesPostRequest, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
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

export const deleteRuleController = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
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