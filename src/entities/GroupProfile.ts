import { Cascade, Collection, Entity, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Group } from "./Group";
import { Rule } from "./Rule";

@Entity()
export class GroupProfile extends Base {

  @Property()
  profilePicture: string;

  @Property({
    type: 'TEXT',
    nullable: true,
  })
  bio!: string;

  @Property()
  bgProfilePicture: string;

  @OneToMany(() => Rule, rule => rule.group, {
    nullable: true,
  })
  rules = new Collection<Rule>(this);

  @OneToOne(() => Group, group => group.profile, {
    owner: true,
    cascade: [Cascade.REMOVE]
  })
  group!: Group;

  constructor(profilePicture: string, bgProfilePicture: string) {
    super();
    this.profilePicture = profilePicture;
    this.bgProfilePicture = bgProfilePicture;
  }

}