import { Migration } from '@mikro-orm/migrations';

export class Migration20210603152033 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "profile" ("id" serial primary key, "username" varchar(255) not null, "profile_photo" varchar(255) not null, "author_id" int4 not null);');
    this.addSql('alter table "profile" add constraint "profile_author_id_unique" unique ("author_id");');

    this.addSql('alter table "profile" add constraint "profile_author_id_foreign" foreign key ("author_id") references "author" ("id") on update cascade;');
  }

}
