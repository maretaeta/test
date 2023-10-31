import { Prisma } from "@prisma/client";

export class ProductSources implements Prisma.ProductSourcesCreateInput {
   id_productSources?: number;
  nama_toko?: string;
  alamat_toko?: string;
  jenis_productSources?: string;
  nama_productSources?: string;
  ukuran_productSources?: string;
  satuan_productSources?: string;
  jumlah_productSources?: number;
  pembelian_productSources?: number;
  ongkosProses_productSources?: number;
  totalPembelian_productSources?: number;
  hargaPerLembar?: number;
}
