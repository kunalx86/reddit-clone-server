import { Cascade, Entity, ManyToOne, PrimaryKeyType, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { User } from "./User";

@Entity()
export class FollowUser extends Base {

  @ManyToOne(() => User, {
    cascade: [Cascade.PERSIST],
  })
  following!: User;

  @ManyToOne(() => User, {
    cascade: [Cascade.PERSIST],
  })
  followedBy!: User;

}