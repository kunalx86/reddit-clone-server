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
    cascade: [Cascade.REMOVE],
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
  })
  parent!: Comment;

  @OneToMany(() => CommentVote, commentVote => commentVote.comment)
  votes = new Collection<CommentVote>(this);

  constructor(comment: string) {
    super();
    this.comment = comment;
  }

}