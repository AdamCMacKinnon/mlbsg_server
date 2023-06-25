import { MigrationInterface, QueryRunner } from 'typeorm';

export class batch1687575919790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS batch
(
    job_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    job_type character varying COLLATE pg_catalog."default" NOT NULL,
    job_start timestamp(3) without time zone NOT NULL DEFAULT now(),
    job_end timestamp(3) without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_e57f84d485145d5be96bc6d871e" PRIMARY KEY (job_id)
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
        DROP TABLE IF EXISTS batch;
        `,
    );
  }
}
