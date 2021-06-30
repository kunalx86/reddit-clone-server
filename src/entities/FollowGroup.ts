import { Cascade, Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class FollowGroup extends Base {

  @ManyToOne(() => User, {
    cascade: [Cascade.PERSIST],
    hidden: true
  })
  user!: User;

  @ManyToOne(() => Group, {
    hidden: true
  })
  group!: Group;

  @Property({
    type: 'BOOLEAN',
    default: false,
  })
  moderator!: boolean;

}