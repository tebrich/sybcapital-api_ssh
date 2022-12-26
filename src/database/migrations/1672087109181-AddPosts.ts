import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPosts1672087109181 implements MigrationInterface {
    name = 'AddPosts1672087109181';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE category (id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, slug varchar(255) NOT NULL, description varchar(255) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), deletedAt datetime(6) NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE tag (id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, slug varchar(255) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), deletedAt datetime(6) NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE post (id int NOT NULL AUTO_INCREMENT, title text NOT NULL, slug varchar(255) NOT NULL, excerpt varchar(255) NOT NULL, content mediumtext NOT NULL, status enum ('BORRADOR', 'PUBLICADO', 'ELIMINADO') NOT NULL DEFAULT 'BORRADOR', createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), deletedAt datetime(6) NULL, authorId int NULL, UNIQUE INDEX IDX_cd1bddce36edc3e766798eab37 (slug), PRIMARY KEY (id)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE post_categories (postId int NOT NULL, categoryId int NOT NULL, INDEX IDX_d9837aecaf223e3cadb55fed67 (postId), INDEX IDX_9bd6598aa52c1550ed7707a71b (categoryId), PRIMARY KEY (postId, categoryId)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE post_tags (postId int NOT NULL, tagId int NOT NULL, INDEX IDX_76e701b89d9bba541e1543adfa (postId), INDEX IDX_86fabcae8483f7cc4fbd36cf6a (tagId), PRIMARY KEY (postId, tagId)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE post ADD CONSTRAINT FK_c6fb082a3114f35d0cc27c518e0 FOREIGN KEY (authorId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE post_categories ADD CONSTRAINT FK_d9837aecaf223e3cadb55fed677 FOREIGN KEY (postId) REFERENCES post(id) ON DELETE RESTRICT ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE post_categories ADD CONSTRAINT FK_9bd6598aa52c1550ed7707a71b9 FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE post_tags ADD CONSTRAINT FK_76e701b89d9bba541e1543adfac FOREIGN KEY (postId) REFERENCES post(id) ON DELETE RESTRICT ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE post_tags ADD CONSTRAINT FK_86fabcae8483f7cc4fbd36cf6a2 FOREIGN KEY (tagId) REFERENCES tag(id) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE post_tags DROP FOREIGN KEY FK_86fabcae8483f7cc4fbd36cf6a2`);
        await queryRunner.query(`ALTER TABLE post_tags DROP FOREIGN KEY FK_76e701b89d9bba541e1543adfac`);
        await queryRunner.query(`ALTER TABLE post_categories DROP FOREIGN KEY FK_9bd6598aa52c1550ed7707a71b9`);
        await queryRunner.query(`ALTER TABLE post_categories DROP FOREIGN KEY FK_d9837aecaf223e3cadb55fed677`);
        await queryRunner.query(`ALTER TABLE post DROP FOREIGN KEY FK_c6fb082a3114f35d0cc27c518e0`);
        await queryRunner.query(`DROP INDEX IDX_86fabcae8483f7cc4fbd36cf6a ON post_tags`);
        await queryRunner.query(`DROP INDEX IDX_76e701b89d9bba541e1543adfa ON post_tags`);
        await queryRunner.query(`DROP TABLE post_tags`);
        await queryRunner.query(`DROP INDEX IDX_9bd6598aa52c1550ed7707a71b ON post_categories`);
        await queryRunner.query(`DROP INDEX IDX_d9837aecaf223e3cadb55fed67 ON post_categories`);
        await queryRunner.query(`DROP TABLE post_categories`);
        await queryRunner.query(`DROP INDEX IDX_cd1bddce36edc3e766798eab37 ON post`);
        await queryRunner.query(`DROP TABLE post`);
        await queryRunner.query(`DROP TABLE tag`);
        await queryRunner.query(`DROP TABLE category`);
    }
}
