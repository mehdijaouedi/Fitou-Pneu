-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_utilisateurId_fkey";

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "utilisateurId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
