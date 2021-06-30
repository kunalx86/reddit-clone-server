import { Migration } from '@mikro-orm/migrations';

export class Migration20210625083846 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "votes_count" int4 not null default 0;');
  }

}
