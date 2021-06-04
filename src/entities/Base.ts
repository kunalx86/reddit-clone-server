import { PrimaryKey, Property } from "@mikro-orm/core";

export abstract class Base {

  @PrimaryKey()
  id!: number;

  @Property({
    type: 'DATE'
  })
  createdAt: Date = new Date();

  @Property({
    type: 'DATE',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

}