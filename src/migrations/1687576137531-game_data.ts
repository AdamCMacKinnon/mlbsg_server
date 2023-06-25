import { MigrationInterface, QueryRunner } from 'typeorm';

export class gameData1687576137531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS game_data
(
    game_pk integer NOT NULL,
    week integer NOT NULL,
    game_date character varying COLLATE pg_catalog."default" NOT NULL,
    home_team character varying COLLATE pg_catalog."default" NOT NULL,
    home_score integer DEFAULT 0,
    home_diff integer DEFAULT 0,
    away_team character varying COLLATE pg_catalog."default" NOT NULL,
    away_score integer DEFAULT 0,
    away_diff integer DEFAULT 0,
    CONSTRAINT "PK_0ce86be14540a6408e7666244b4" PRIMARY KEY (game_pk)
)
WITH (
    OIDS = FALSE
)
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP TABLE IF EXISTS game_data;
        `,
    );
  }
}
