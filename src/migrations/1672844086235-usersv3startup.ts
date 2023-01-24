import { MigrationInterface, QueryRunner } from 'typeorm';

export class usersv3startup1672844086235 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS "user"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    isactive boolean NOT NULL DEFAULT true,
    admin boolean NOT NULL DEFAULT false,
    pastchamp boolean NOT NULL DEFAULT false,
    diff integer NOT NULL DEFAULT 0,
    "createdAt" timestamp(3) without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
    CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username)
)
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP TABLE IF EXISTS "user"
        `,
    );
  }
}
