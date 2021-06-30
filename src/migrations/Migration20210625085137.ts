import { Migration } from '@mikro-orm/migrations';

export class Migration20210625085137 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" add column "votes_count" int4 not null default 0;');
  }

}
