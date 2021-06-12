import { Cascade, Entity, Enum, OneToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Post } from "./Post";

export enum MediaType {
  IMAGE = "IMAGE",
  GIF = "GIF",
  TEXT = "TEXT"
}

@Entity()
export class Media extends Base {

  @Enum(() => MediaType)
  type: MediaType

  @Property({
    nullable: true,
  })
  mediaUrl!: string;

  @Property({
    nullable: true,
    type: 'TEXT'
  })
  mediaText!: string;

  @OneToOne(() => Post, post => post.media, {
    cascade: [Cascade.REMOVE],
  })
  post!: Post;

  constructor(type: MediaType) {
    super();
    this.type = type;
  }

}