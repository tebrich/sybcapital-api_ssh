import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostFiles1672120439907 implements MigrationInterface {
    name = 'AddPostFiles1672120439907';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE post_files (postId int NOT NULL, filesId int NOT NULL, INDEX IDX_a12706e0fd90132ab2ffa9b0b1 (postId), INDEX IDX_46bbc4ddff9b496d24df17b34a (filesId), PRIMARY KEY (postId, filesId)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE post_files ADD CONSTRAINT FK_a12706e0fd90132ab2ffa9b0b1e FOREIGN KEY (postId) REFERENCES post(id) ON DELETE RESTRICT ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE post_files ADD CONSTRAINT FK_46bbc4ddff9b496d24df17b34ad FOREIGN KEY (filesId) REFERENCES files(id) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE post_files DROP FOREIGN KEY FK_46bbc4ddff9b496d24df17b34ad`);
        await queryRunner.query(`ALTER TABLE post_files DROP FOREIGN KEY FK_a12706e0fd90132ab2ffa9b0b1e`);
        await queryRunner.query(`DROP INDEX IDX_46bbc4ddff9b496d24df17b34a ON post_files`);
        await queryRunner.query(`DROP INDEX IDX_a12706e0fd90132ab2ffa9b0b1 ON post_files`);
        await queryRunner.query(`DROP TABLE post_files`);
    }
}
