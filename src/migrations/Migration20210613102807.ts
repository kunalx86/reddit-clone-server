import { Migration } from '@mikro-orm/migrations';

export class Migration20210613102807 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post_vote" drop column "created_at";');
    this.addSql('alter table "post_vote" drop column "updated_at";');

    this.addSql('alter table "follow_user" drop column "created_at";');
    this.addSql('alter table "follow_user" drop column "updated_at";');

    this.addSql('alter table "follow_group" drop column "created_at";');
    this.addSql('alter table "follow_group" drop column "updated_at";');

    this.addSql('alter table "comment_vote" drop column "created_at";');
    this.addSql('alter table "comment_vote" drop column "updated_at";');
  }

}
