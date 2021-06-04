import { Collection, Entity, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { FollowUser } from "./FollowUser";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { PostVote } from "./PostVote";
import { UserProfile } from "./UserProfile";
import { CommentVote } from "./CommentVote";
import { Group } from "./Group";
import { FollowGroup } from "./FollowGroup";

@Entity()
export class User extends Base {

  @Property()
  username: string;

  @Property()
  email: string;

  @Property()
  hashedPwd: string;

  @OneToOne(() => UserProfile, profile => profile.user, {
    mappedBy: "user",
  })
  profile!: UserProfile

  @OneToMany(() => FollowUser, follow => follow.following)
  followingUsers!: Collection<FollowUser>;

  @OneToMany(() => FollowUser, follow => follow.following)
  followedByUsers!: Collection<FollowUser>;

  @OneToMany(() => Post, post => post.author)
  posts!: Collection<Post>;

  @OneToMany(() => PostVote, postVote => postVote.user)
  postVotes!: Collection<PostVote>;

  @OneToMany(() => Comment, comment => comment.user)
  comments!: Collection<Comment>;

  @OneToMany(() => CommentVote, commentVote => commentVote.user)
  commentVotes!: Collection<CommentVote>;

  @OneToMany(() => Group, group => group.owner)
  groupsCreated!: Collection<Group>;

  @OneToMany(() => FollowGroup, followGroup => followGroup.user)
  followingGroups!: Collection<FollowGroup>;

  constructor(username: string, email: string, hashedPwd: string) {
    super();
    this.username = username;
    this.email = email;
    this.hashedPwd = hashedPwd;
  }

}