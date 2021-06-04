import { Cascade, Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class FollowGroup extends Base {

  @ManyToOne(() => User, {
    cascade: [Cascade.REMOVE],
  })
  user!: User;

  @ManyToOne(() => Group)
  group!: Group;

  @Property({
    type: 'BOOLEAN',
    default: false,
  })
  moderator!: boolean;

}