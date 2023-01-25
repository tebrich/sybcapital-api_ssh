import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContactEntity1674608127119 implements MigrationInterface {
    name = 'AddContactEntity1674608127119';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE contact (id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, email varchar(255) NOT NULL, message varchar(200) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), deletedAt datetime(6) NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE contact`);
    }
}
