import { Migration } from '@mikro-orm/migrations';

export class Migration20210604140005 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "email" varchar(255) not null, "hashed_pwd" varchar(255) not null);');

    this.addSql('create table "user_profile" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "profile_picture" varchar(255) not null, "full_name" varchar(255) null, "bio" text null, "bg_profile_picture" varchar(255) not null, "user_id" int4 null);');
    this.addSql('alter table "user_profile" add constraint "user_profile_user_id_unique" unique ("user_id");');

    this.addSql('create table "media" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "type" text check ("type" in (\'IMAGE\', \'GIF\', \'TEXT\')) not null, "media_url" varchar(255) null, "media_text" text null);');

    this.addSql('create table "group" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "owner_id" int4 not null);');

    this.addSql('create table "group_profile" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "profile_picture" varchar(255) not null, "bio" text null, "bg_profile_picture" varchar(255) not null, "group_id" int4 null);');
    this.addSql('alter table "group_profile" add constraint "group_profile_group_id_unique" unique ("group_id");');

    this.addSql('create table "rule" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "rule" varchar(255) not null, "group_id" int4 not null);');

    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "author_id" int4 not null, "media_id" int4 not null, "group_id" int4 null);');
    this.addSql('alter table "post" add constraint "post_media_id_unique" unique ("media_id");');

    this.addSql('create table "post_vote" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "vote" int4 not null, "post_id" int4 null, "user_id" int4 null);');

    this.addSql('create table "follow_group" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int4 null, "group_id" int4 not null, "moderator" bool not null default false);');

    this.addSql('create table "comment" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "comment" text not null, "user_id" int4 not null, "post_id" int4 null, "parent_id" int4 null);');

    this.addSql('create table "comment_vote" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "comment_id" int4 null, "user_id" int4 null, "vote" int4 not null);');

    this.addSql('alter table "user_profile" add constraint "user_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;');

    this.addSql('alter table "group" add constraint "group_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "group_profile" add constraint "group_profile_group_id_foreign" foreign key ("group_id") references "group" ("id") on delete cascade;');

    this.addSql('alter table "rule" add constraint "rule_group_id_foreign" foreign key ("group_id") references "group_profile" ("id") on update cascade;');

    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "post" add constraint "post_media_id_foreign" foreign key ("media_id") references "media" ("id") on update cascade;');
    this.addSql('alter table "post" add constraint "post_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete set null;');

    this.addSql('alter table "post_vote" add constraint "post_vote_post_id_foreign" foreign key ("post_id") references "post" ("id") on delete cascade;');
    this.addSql('alter table "post_vote" add constraint "post_vote_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;');

    this.addSql('alter table "follow_group" add constraint "follow_group_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;');
    this.addSql('alter table "follow_group" add constraint "follow_group_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on delete cascade;');
    this.addSql('alter table "comment" add constraint "comment_parent_id_foreign" foreign key ("parent_id") references "comment" ("id") on update cascade on delete set null;');

    this.addSql('alter table "comment_vote" add constraint "comment_vote_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on delete cascade;');
    this.addSql('alter table "comment_vote" add constraint "comment_vote_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;');
  }

}
