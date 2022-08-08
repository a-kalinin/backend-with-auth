import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1659601383301 implements MigrationInterface {
    name = 'migration1659601383301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "accessToken" character varying NOT NULL, "accessTokenExpiresOn" TIMESTAMP NOT NULL, "refreshToken" character varying NOT NULL, "refreshTokenExpiresOn" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "token_pkey" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "access-token-idx" ON "tokens" ("accessToken") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "refresh-token-idx" ON "tokens" ("refreshToken") `);
        await queryRunner.query(`CREATE TABLE "activation_codes" ("id" SERIAL NOT NULL, "code" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "expiresOn" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "activation_code_pkey" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "activation_code_idx" ON "activation_codes" ("code") `);
        await queryRunner.query(`CREATE TYPE "public"."UserScope" AS ENUM('profile')`);
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "firstName" character varying(100), "middleName" character varying(100), "lastName" character varying(100), "passwordSalt" character varying(30) NOT NULL, "passwordHash" character varying(50) NOT NULL, "scopes" "public"."UserScope" NOT NULL DEFAULT 'profile', "isActivated" boolean NOT NULL DEFAULT false, CONSTRAINT "user_pkey" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user-email-idx" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activation_codes" ADD CONSTRAINT "FK_c7435d7fca5b757adbfdf5a793b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activation_codes" DROP CONSTRAINT "FK_c7435d7fca5b757adbfdf5a793b"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`);
        await queryRunner.query(`DROP INDEX "public"."user-email-idx"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."UserScope"`);
        await queryRunner.query(`DROP INDEX "public"."activation_code_idx"`);
        await queryRunner.query(`DROP TABLE "activation_codes"`);
        await queryRunner.query(`DROP INDEX "public"."refresh-token-idx"`);
        await queryRunner.query(`DROP INDEX "public"."access-token-idx"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
    }

}
