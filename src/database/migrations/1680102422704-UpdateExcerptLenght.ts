import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExcerptLenght1680102422704 implements MigrationInterface {
    name = 'UpdateExcerptLenght1680102422704';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE post MODIFY excerpt mediumtext not null;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE post MODIFY excerpt varchar(255) not null`);
    }
}
