/*
  Warnings:

  - A unique constraint covering the columns `[penjualanId]` on the table `Penjualan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Penjualan" ADD COLUMN     "penjualanId" INTEGER;

-- CreateTable
CREATE TABLE "Pendapatan" (
    "id_pendapatan" SERIAL NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "tahun" INTEGER,
    "userId" INTEGER,
    "penjualanId" INTEGER,

    CONSTRAINT "Pendapatan_pkey" PRIMARY KEY ("id_pendapatan")
);

-- CreateTable
CREATE TABLE "Pengeluaran" (
    "id_pengeluaran" SERIAL NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "keterangan" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Pengeluaran_pkey" PRIMARY KEY ("id_pengeluaran")
);

-- CreateTable
CREATE TABLE "Karyawan" (
    "id_karyawan" SERIAL NOT NULL,
    "nama_karyawan" TEXT,
    "jabatan" TEXT,
    "gaji" INTEGER,
    "tanggal_masuk" TIMESTAMP(3),
    "userId" INTEGER,

    CONSTRAINT "Karyawan_pkey" PRIMARY KEY ("id_karyawan")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pendapatan_penjualanId_key" ON "Pendapatan"("penjualanId");

-- CreateIndex
CREATE UNIQUE INDEX "Penjualan_penjualanId_key" ON "Penjualan"("penjualanId");

-- AddForeignKey
ALTER TABLE "Pendapatan" ADD CONSTRAINT "Pendapatan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id_users") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pendapatan" ADD CONSTRAINT "Pendapatan_penjualanId_fkey" FOREIGN KEY ("penjualanId") REFERENCES "Penjualan"("id_penjualan") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengeluaran" ADD CONSTRAINT "Pengeluaran_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id_users") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Karyawan" ADD CONSTRAINT "Karyawan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id_users") ON DELETE SET NULL ON UPDATE CASCADE;
