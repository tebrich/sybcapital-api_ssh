import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueConstraint1672095848151 implements MigrationInterface {
    name = 'UniqueConstraint1672095848151';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE post_categories DROP FOREIGN KEY FK_9bd6598aa52c1550ed7707a71b9`);
        await queryRunner.query(`ALTER TABLE post_tags DROP FOREIGN KEY FK_86fabcae8483f7cc4fbd36cf6a2`);
        await queryRunner.query(`ALTER TABLE tag ADD UNIQUE INDEX IDX_3413aed3ecde54f832c4f44f04 (slug)`);
        await queryRunner.query(`ALTER TABLE category ADD UNIQUE INDEX IDX_cb73208f151aa71cdd78f662d7 (slug)`);
        await queryRunner.query(
            `ALTER TABLE post_categories ADD CONSTRAINT FK_9bd6598aa52c1550ed7707a71b9 FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE post_tags ADD CONSTRAINT FK_86fabcae8483f7cc4fbd36cf6a2 FOREIGN KEY (tagId) REFERENCES tag(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE post_tags DROP FOREIGN KEY FK_86fabcae8483f7cc4fbd36cf6a2`);
        await queryRunner.query(`ALTER TABLE post_categories DROP FOREIGN KEY FK_9bd6598aa52c1550ed7707a71b9`);
        await queryRunner.query(`ALTER TABLE category DROP INDEX IDX_cb73208f151aa71cdd78f662d7`);
        await queryRunner.query(`ALTER TABLE tag DROP INDEX IDX_3413aed3ecde54f832c4f44f04`);
        await queryRunner.query(
            `ALTER TABLE post_tags ADD CONSTRAINT FK_86fabcae8483f7cc4fbd36cf6a2 FOREIGN KEY (tagId) REFERENCES tag(id) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE post_categories ADD CONSTRAINT FK_9bd6598aa52c1550ed7707a71b9 FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }
}
