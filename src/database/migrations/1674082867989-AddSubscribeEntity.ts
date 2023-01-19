import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubscribeEntity1674082867989 implements MigrationInterface {
    name = 'AddSubscribeEntity1674082867989';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE subscribe (uuid varchar(36) NOT NULL, name varchar(255) NOT NULL, email varchar(255) NOT NULL, subscribed tinyint NOT NULL DEFAULT 1, UNIQUE INDEX IDX_ccd17da54ad3367a752be47697 (email), PRIMARY KEY (uuid)) ENGINE=InnoDB`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IDX_ccd17da54ad3367a752be47697 ON subscribe`);
        await queryRunner.query(`DROP TABLE subscribe`);
    }
}
