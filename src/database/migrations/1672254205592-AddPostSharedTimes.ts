import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostSharedTimes1672254205592 implements MigrationInterface {
    name = 'AddPostSharedTimes1672254205592';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE post ADD shared json NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE post DROP COLUMN shared`);
    }
}
