/*
  Warnings:

  - Added the required column `exchange_type` to the `exchanges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exchanges" ADD COLUMN "exchange_type" TEXT NOT NULL;
