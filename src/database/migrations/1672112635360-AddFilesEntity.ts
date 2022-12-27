import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFilesEntity1672112635360 implements MigrationInterface {
    name = 'AddFilesEntity1672112635360';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE files (id int NOT NULL AUTO_INCREMENT, url varchar(255) NOT NULL, feature tinyint NOT NULL DEFAULT 0, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), deletedAt datetime(6) NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE files`);
    }
}
