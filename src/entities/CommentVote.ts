import { Cascade, Entity, ManyToOne, PrimaryKeyType, Property } from "@mikro-orm/core";
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
  })
  user!: User;

  @Property()
  vote: number;

  constructor(vote: number) {
    super();
    this.vote = vote;
  }

}