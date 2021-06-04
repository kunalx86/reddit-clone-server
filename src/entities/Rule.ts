import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { GroupProfile } from "./GroupProfile";

@Entity()
export class Rule extends Base {

  @Property()
  rule: string;

  @ManyToOne(() => GroupProfile)
  group!: GroupProfile;

  constructor(rule: string) {
    super();
    this.rule = rule;
  }

}