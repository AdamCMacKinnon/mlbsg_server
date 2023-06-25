import { MigrationInterface, QueryRunner } from 'typeorm';

export class email1687575992644 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS email
(
    email_id character varying COLLATE pg_catalog."default" NOT NULL,
    job_id character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default" NOT NULL,
    username character varying COLLATE pg_catalog."default",
    email_type character varying COLLATE pg_catalog."default" NOT NULL,
    email_sent timestamp(3) without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_45dd58d0832518a56ba30e5e5e0" PRIMARY KEY (email_id)
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
        DROP TABLE IF EXISTS email;
        `,
    );
  }
}
