import { Migration } from '@mikro-orm/migrations';

export class Migration20210606104317 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "follow_user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "following_id" int4 null, "followed_by_id" int4 null);');

    this.addSql('alter table "follow_user" add constraint "follow_user_following_id_foreign" foreign key ("following_id") references "user" ("id") on delete cascade;');
    this.addSql('alter table "follow_user" add constraint "follow_user_followed_by_id_foreign" foreign key ("followed_by_id") references "user" ("id") on delete cascade;');
  }

}
