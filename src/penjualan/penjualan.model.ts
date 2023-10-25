import { Prisma } from "@prisma/client";

export class penjualan implements Prisma.PenjualanCreateInput{
    id_penjualan: number;
    jenis_product?: string;
    nama_product?: string;
    ukuran_product?: string;
    jumlah_product?: number;
    harga_product?: number;
    diskon?: number;
    totalHarga_product?: number;
}