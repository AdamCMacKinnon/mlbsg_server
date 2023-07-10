import { MigrationInterface, QueryRunner } from 'typeorm';

export class picks1687566075993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS picks
(
    "pickId" character varying COLLATE pg_catalog."default" NOT NULL,
    week integer NOT NULL,
    pick character varying COLLATE pg_catalog."default" NOT NULL,
    run_diff integer NOT NULL DEFAULT 0,
    "userId" uuid NOT NULL,
    CONSTRAINT "PK_c66e078bd4707ec53bee534f977" PRIMARY KEY ("pickId"),
    CONSTRAINT "FK_99d8adcf9795fec1939ae224f7c" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP TABLE IF EXISTS picks;
        `,
    );
  }
}
