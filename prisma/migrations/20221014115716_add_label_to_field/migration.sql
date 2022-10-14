/*
  Warnings:

  - Added the required column `label` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "label" TEXT NOT NULL;
