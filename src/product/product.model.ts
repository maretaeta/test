import { Prisma } from '@prisma/client';

export class product implements Prisma.ProductCreateInput{
    id_product: number;
    jenis_product?: string;
    nama_product?: string;
    ukuran_product?: string;
    stok_product?: number;
    harga_product?: number;
    keuntungan?: number;
    hargaJual?: number;
}