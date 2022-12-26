import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserEntity1672069514810 implements MigrationInterface {
    name = 'AddUserEntity1672069514810';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE user (id int NOT NULL AUTO_INCREMENT, firstName varchar(255) NOT NULL, lastName varchar(255) NOT NULL, fullName varchar(255) NOT NULL, createdAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), deletedAt timestamp(6) NULL, email varchar(255) NOT NULL, password text NOT NULL, phoneNumber varchar(255) NOT NULL, active tinyint NOT NULL DEFAULT 1, salt varchar(255) NULL, UNIQUE INDEX IDX_e12875dfb3b1d92d7d7c5377e2 (email), PRIMARY KEY (id)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE password_recover (id int NOT NULL AUTO_INCREMENT, link varchar(36) NOT NULL, created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), users_id int NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE password_recover ADD CONSTRAINT FK_caa50fd05c55806a7cebc7f3c33 FOREIGN KEY (users_id) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE password_recover DROP FOREIGN KEY FK_caa50fd05c55806a7cebc7f3c33`);
        await queryRunner.query(`DROP TABLE password_recover`);
        await queryRunner.query(`DROP INDEX IDX_e12875dfb3b1d92d7d7c5377e2 ON user`);
        await queryRunner.query(`DROP TABLE user`);
    }
}
