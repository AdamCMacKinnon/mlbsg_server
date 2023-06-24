import { MigrationInterface, QueryRunner } from 'typeorm';

export class emailRejects1687576068782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS email_rejects
(
    email_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email character varying COLLATE pg_catalog."default" NOT NULL,
    job_id character varying COLLATE pg_catalog."default",
    username character varying COLLATE pg_catalog."default",
    email_type character varying COLLATE pg_catalog."default" NOT NULL,
    error_message character varying COLLATE pg_catalog."default" NOT NULL,
    email_sent timestamp(3) without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_c4601018907fc828e3abd918c27" PRIMARY KEY (email_id)
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
        DROP TABLE IF EXISTS email_rejects;
        `,
    );
  }
}
