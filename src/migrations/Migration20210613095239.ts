import { Migration } from '@mikro-orm/migrations';

export class Migration20210613095239 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_profile" drop constraint if exists "user_profile_user_id_check";');
    this.addSql('alter table "user_profile" alter column "user_id" type int4 using ("user_id"::int4);');
    this.addSql('alter table "user_profile" alter column "user_id" set not null;');
    // this.addSql('alter table "user_profile" add constraint if exists "user_profile_user_id_unique" unique ("user_id");');

    this.addSql('alter table "group_profile" drop constraint if exists "group_profile_group_id_check";');
    this.addSql('alter table "group_profile" alter column "group_id" type int4 using ("group_id"::int4);');
    this.addSql('alter table "group_profile" alter column "group_id" set not null;');
    // this.addSql('alter table "group_profile" add constraint "group_profile_group_id_unique" unique ("group_id");');

    this.addSql('alter table "post_vote" drop constraint if exists "post_vote_post_id_check";');
    this.addSql('alter table "post_vote" alter column "post_id" type int4 using ("post_id"::int4);');
    this.addSql('alter table "post_vote" alter column "post_id" set not null;');
    this.addSql('alter table "post_vote" drop constraint if exists "post_vote_user_id_check";');
    this.addSql('alter table "post_vote" alter column "user_id" type int4 using ("user_id"::int4);');
    this.addSql('alter table "post_vote" alter column "user_id" set not null;');

    this.addSql('alter table "follow_user" drop constraint if exists "follow_user_following_id_check";');
    this.addSql('alter table "follow_user" alter column "following_id" type int4 using ("following_id"::int4);');
    this.addSql('alter table "follow_user" alter column "following_id" set not null;');
    this.addSql('alter table "follow_user" drop constraint if exists "follow_user_followed_by_id_check";');
    this.addSql('alter table "follow_user" alter column "followed_by_id" type int4 using ("followed_by_id"::int4);');
    this.addSql('alter table "follow_user" alter column "followed_by_id" set not null;');

    this.addSql('alter table "follow_group" drop constraint if exists "follow_group_user_id_check";');
    this.addSql('alter table "follow_group" alter column "user_id" type int4 using ("user_id"::int4);');
    this.addSql('alter table "follow_group" alter column "user_id" set not null;');

    this.addSql('alter table "comment" drop constraint if exists "comment_post_id_check";');
    this.addSql('alter table "comment" alter column "post_id" type int4 using ("post_id"::int4);');
    this.addSql('alter table "comment" alter column "post_id" set not null;');

    this.addSql('alter table "comment_vote" drop constraint if exists "comment_vote_comment_id_check";');
    this.addSql('alter table "comment_vote" alter column "comment_id" type int4 using ("comment_id"::int4);');
    this.addSql('alter table "comment_vote" alter column "comment_id" set not null;');
    this.addSql('alter table "comment_vote" drop constraint if exists "comment_vote_user_id_check";');
    this.addSql('alter table "comment_vote" alter column "user_id" type int4 using ("user_id"::int4);');
    this.addSql('alter table "comment_vote" alter column "user_id" set not null;');
  }

}
