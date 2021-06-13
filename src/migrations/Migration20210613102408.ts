import { Migration } from '@mikro-orm/migrations';

export class Migration20210613102408 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post_vote" drop column "id";');

    this.addSql('alter table "follow_user" drop column "id";');

    this.addSql('alter table "follow_group" drop column "id";');

    this.addSql('alter table "comment_vote" drop column "id";');
  }

}
