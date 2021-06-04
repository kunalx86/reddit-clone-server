import { Cascade, Entity, OneToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { User } from "./User";

@Entity()
export class UserProfile extends Base {

  @Property()
  profilePicture: string;

  @Property({
    nullable: true,
  })
  fullName!: string;

  @Property({
    type: 'TEXT',
    nullable: true,
  })
  bio!: string;

  @Property()
  bgProfilePicture: string;

  @OneToOne(() => User, user => user.profile, {
    owner: true,
    cascade: [Cascade.REMOVE]
  })
  user!: User;

  constructor(profilePicture: string, bgProfilePicture: string) {
    super();
    this.profilePicture = profilePicture;
    this.bgProfilePicture = bgProfilePicture;
  }

}