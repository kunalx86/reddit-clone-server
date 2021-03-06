import argon from "argon2";
import { Collection, Entity, OneToMany, OneToOne, Property, RequestContext } from "@mikro-orm/core";
import { Base } from "./Base";
import { FollowUser } from "./FollowUser";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { PostVote } from "./PostVote";
import { UserProfile } from "./UserProfile";
import { CommentVote } from "./CommentVote";
import { Group } from "./Group";
import { FollowGroup } from "./FollowGroup";
import { EntityManager } from "@mikro-orm/postgresql";

@Entity()
export class User extends Base {

  @Property()
  username: string;

  @Property({
    hidden: true
  })
  email: string;

  @Property({
    hidden: true,
  })
  hashedPwd!: string;

  @OneToOne(() => UserProfile, profile => profile.user, {
    mappedBy: "user",
  })
  profile!: UserProfile

  @OneToMany(() => FollowUser, follow => follow.followedBy, {
    hidden: true
  })
  followingUsers = new Collection<FollowUser>(this);

  @OneToMany(() => FollowUser, follow => follow.following, {
    hidden: true
  })
  followedByUsers = new Collection<FollowUser>(this);

  @OneToMany(() => Post, post => post.author)
  posts = new Collection<Post>(this);

  @OneToMany(() => PostVote, postVote => postVote.user)
  postVotes = new Collection<PostVote>(this);

  @OneToMany(() => Comment, comment => comment.user)
  comments = new Collection<Comment>(this);

  @OneToMany(() => CommentVote, commentVote => commentVote.user)
  commentVotes = new Collection<CommentVote>(this);

  @OneToMany(() => Group, group => group.owner)
  groupsCreated = new Collection<Group>(this);

  @OneToMany(() => FollowGroup, followGroup => followGroup.user, {
    hidden: true
  })
  followingGroups = new Collection<FollowGroup>(this);

  constructor(username: string, email: string) {
    super();
    this.username = username;
    this.email = email;
  }

  async generateHashPassword(password: string) {
    this.hashedPwd = await argon.hash(password);
  }

  async verifyPassword(password: string) {
    return await argon.verify(this.hashedPwd, password);
  }

  getFollowers() {
    return this.followedByUsers.getItems().map(f => f.followedBy)
  }

  getFollowing() {
    return this.followingUsers.getItems().map(f => f.following)
  }

  static getUser(userId: number) {
    const em = RequestContext.getEntityManager() as EntityManager;
    return em.findOneOrFail(User, {
      id: userId
    });
  }

}