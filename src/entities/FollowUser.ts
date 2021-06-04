import { Cascade, ManyToOne } from "@mikro-orm/core";
import { Base } from "./Base";
import { User } from "./User";

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