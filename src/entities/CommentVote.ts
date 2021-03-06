import { Cascade, Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Comment } from "./Comment";
import { User } from "./User";

@Entity()
export class CommentVote extends Base {

  @ManyToOne(() => Comment, {
    cascade: [Cascade.PERSIST],
  })
  comment!: Comment;

  @ManyToOne(() => User, {
    cascade: [Cascade.PERSIST],
    hidden: true
  })
  user!: User;

  @Property()
  vote: number;

  constructor(vote: number) {
    super();
    this.vote = vote;
  }

}