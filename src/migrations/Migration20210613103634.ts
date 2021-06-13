import { Migration } from '@mikro-orm/migrations';

export class Migration20210613103634 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post_vote" add column "id" serial primary key, add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');

    this.addSql('alter table "follow_user" add column "id" serial primary key, add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');

    this.addSql('alter table "follow_group" add column "id" serial primary key, add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');

    this.addSql('alter table "comment_vote" add column "id" serial primary key, add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');
  }

}
