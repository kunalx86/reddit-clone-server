import { Cascade, Collection, Entity, ManyToOne, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { FollowGroup } from "./FollowGroup";
import { GroupProfile } from "./GroupProfile";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Group extends Base {

  @Property()
  name: string;

  @ManyToOne(() => User, {
    cascade: [Cascade.PERSIST],
  })
  owner!: User;

  @OneToMany(() => Post, post => post.group)
  posts!: Collection<Post>;

  @OneToMany(() => FollowGroup, followGroup => followGroup.group)
  followers!: Collection<FollowGroup>;

  @OneToOne(() => GroupProfile, groupProfile => groupProfile.group)
  profile!: GroupProfile;

  constructor(name: string) {
    super();
    this.name = name;
  }

}