import { Cascade, Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class PostVote extends Base {

  @Property()
  vote: number;

  @ManyToOne(() => Post, {
    cascade: [Cascade.REMOVE],
  })
  post!: Post;

  @ManyToOne(() => User, {
    cascade: [Cascade.REMOVE],
  })
  user!: User;

  constructor(vote: number) {
    super();
    this.vote = vote;
  }

}