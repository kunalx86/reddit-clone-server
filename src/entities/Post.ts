import { Cascade, Collection, Entity, ManyToOne, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Comment } from "./Comment";
import { Group } from "./Group";
import { Media } from "./Media";
import { PostVote } from "./PostVote";
import { User } from "./User";

@Entity()
export class Post extends Base {

  @Property()
  title: string;

  @ManyToOne(() => User, {
    cascade: [Cascade.PERSIST],
  })
  author!: User;

  @OneToOne(() => Media, media => media.post, {
    owner: true
  })
  media!: Media;

  @OneToMany(() => PostVote, postVote => postVote.post)
  votes = new Collection<PostVote>(this);

  @OneToMany(() => Comment, comment => comment.post)
  comments = new Collection<Comment>(this);

  @ManyToOne(() => Group, {
    nullable: true,
  })
  group!: Group;

  constructor(title: string) {
    super();
    this.title = title;
  }

  getVotes() {
    const { vote: voteCount } = this.votes.toArray().reduce((acc, curr) => ({ vote: acc.vote + curr.vote }), { vote: 0 });
    return voteCount;
  }

  getHasVoted(userId: number) {
    const [hasVoted] = this.votes.toArray().filter(vote => {
      if (vote.user instanceof User)
        return vote.user.id === userId
      return vote.user === userId
    })
    return hasVoted?.vote
  }
}