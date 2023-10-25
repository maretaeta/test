-- CreateTable
CREATE TABLE "Toko" (
    "id_toko" SERIAL NOT NULL,
    "namatoko" TEXT,
    "notlp_toko" VARCHAR(20),
    "alamat_toko" TEXT,

    CONSTRAINT "Toko_pkey" PRIMARY KEY ("id_toko")
);

-- CreateTable
CREATE TABLE "Penjualan" (
    "id_penjualan" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama_toko" TEXT,
    "jenis_product" VARCHAR(225),
    "nama_product" VARCHAR(225),
    "ukuran_product" VARCHAR(50),
    "diskon" INTEGER,
    "totalHarga_product" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "Penjualan_pkey" PRIMARY KEY ("id_penjualan")
);

-- CreateTable
CREATE TABLE "PenjualanItem" (
    "id_penjualanItem" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "penjualanId" INTEGER NOT NULL,

    CONSTRAINT "PenjualanItem_pkey" PRIMARY KEY ("id_penjualanItem")
);

-- CreateTable
CREATE TABLE "Product" (
    "id_product" SERIAL NOT NULL,
    "jenis_product" VARCHAR(225),
    "nama_product" VARCHAR(225),
    "ukuran_product" VARCHAR(50),
    "stok_product" INTEGER,
    "harga_product" INTEGER,
    "keuntungan" INTEGER,
    "hargaJual" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id_product")
);

-- CreateTable
CREATE TABLE "ProductSources" (
    "id_productSources" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama_toko" TEXT,
    "alamat_toko" TEXT,
    "jenis_productSources" TEXT,
    "nama_productSources" TEXT,
    "ukuran_productSources" TEXT,
    "satuan_productSources" TEXT,
    "jumlah_productSources" INTEGER,
    "pembelian_productSources" INTEGER,
    "ongkosProses_productSources" INTEGER,
    "totalPembelian_productSources" INTEGER,
    "hargaPerLembar" INTEGER,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "ProductSources_pkey" PRIMARY KEY ("id_productSources")
);

-- CreateTable
CREATE TABLE "Users" (
    "id_users" SERIAL NOT NULL,
    "nama" VARCHAR(50),
    "username" VARCHAR(50),
    "password" VARCHAR(225),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id_users")
);

-- CreateTable
CREATE TABLE "_PenjualanToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Toko_namatoko_key" ON "Toko"("namatoko");

-- CreateIndex
CREATE UNIQUE INDEX "Product_nama_product_key" ON "Product"("nama_product");

-- CreateIndex
CREATE UNIQUE INDEX "_PenjualanToProduct_AB_unique" ON "_PenjualanToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PenjualanToProduct_B_index" ON "_PenjualanToProduct"("B");

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_nama_toko_fkey" FOREIGN KEY ("nama_toko") REFERENCES "Toko"("namatoko") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id_users") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenjualanItem" ADD CONSTRAINT "PenjualanItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id_product") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenjualanItem" ADD CONSTRAINT "PenjualanItem_penjualanId_fkey" FOREIGN KEY ("penjualanId") REFERENCES "Penjualan"("id_penjualan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSources" ADD CONSTRAINT "ProductSources_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id_product") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSources" ADD CONSTRAINT "ProductSources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id_users") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PenjualanToProduct" ADD CONSTRAINT "_PenjualanToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Penjualan"("id_penjualan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PenjualanToProduct" ADD CONSTRAINT "_PenjualanToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id_product") ON DELETE CASCADE ON UPDATE CASCADE;
