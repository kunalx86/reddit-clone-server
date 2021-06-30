import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { CommentVote } from "./CommentVote";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment extends Base {

  @Property({
    type: 'TEXT'
  })
  comment: string;

  @ManyToOne(() => User, {
    cascade: [Cascade.PERSIST],
  })
  user!: User;

  @ManyToOne(() => Post, {
    cascade: [Cascade.PERSIST],
  })
  post!: Post;

  @OneToMany(() => Comment, comment => comment.parent, {
    nullable: true,
    cascade: [Cascade.PERSIST],
  })
  replies = new Collection<Comment>(this);

  @ManyToOne(() => Comment, {
    nullable: true,
    cascade: [Cascade.PERSIST],
    hidden: true,
  })
  parent!: Comment;

  @OneToMany(() => CommentVote, commentVote => commentVote.comment, {
    hidden: true
  })
  votes = new Collection<CommentVote>(this);

  @Property({
    default: 0
  })
  votesCount!: number

  constructor(comment: string) {
    super();
    this.comment = comment;
  }

  getHasVoted(userId: number) {
    const [hasVoted] = this.votes.getItems().filter(vote => {
      if (vote.user instanceof User)
        return vote.user.id === userId
      return vote.user === userId
    })
    return hasVoted?.vote
  }
}