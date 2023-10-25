import { Prisma } from "@prisma/client";

export class productSources implements Prisma.ProductSourcesCreateInput {
  id_productSources: number;
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
  product: {
    create: {
      jenis_product?: string;
      nama_product?: string;
      ukuran_product?: string;
      stok_product?: number;
      harga_product?: number;
    };
  };
}
