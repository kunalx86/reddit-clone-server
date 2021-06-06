import { Cascade, Entity, ManyToOne } from "@mikro-orm/core";
import { Base } from "./Base";
import { User } from "./User";

@Entity()
export class FollowUser extends Base {

  @ManyToOne(() => User, {
    cascade: [Cascade.REMOVE]
  })
  following!: User;

  @ManyToOne(() => User, {
    cascade: [Cascade.REMOVE]
  })
  followedBy!: User;

}