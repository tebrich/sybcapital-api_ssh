import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryParent1673816827630 implements MigrationInterface {
    name = 'CategoryParent1673816827630';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE category ADD featured tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE category ADD parent_id int NULL`);
        await queryRunner.query(
            `ALTER TABLE category ADD CONSTRAINT FK_1117b4fcb3cd4abb4383e1c2743 FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE category DROP FOREIGN KEY FK_1117b4fcb3cd4abb4383e1c2743`);
        await queryRunner.query(`ALTER TABLE category DROP COLUMN parent_id`);
        await queryRunner.query(`ALTER TABLE category DROP COLUMN featured`);
    }
}
