import { MigrationInterface, QueryRunner } from 'typeorm';

export class picksv3startup1672844093170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS "picks"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    week integer NOT NULL,
    pick character varying COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) without time zone NOT NULL DEFAULT now(),
    "userId" uuid,
    CONSTRAINT "PK_3e9953ba017bf0d7b7cdde41718" PRIMARY KEY (id),
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
        DELETE TABLE IF EXISTS "picks"
        `,
    );
  }
}
