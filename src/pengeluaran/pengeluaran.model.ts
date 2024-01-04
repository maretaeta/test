import { Prisma } from "@prisma/client";

export class pengeluaran implements Prisma.PengeluaranCreateInput{
    id_pengeluaran: number;
    jumlah: number;
    keterangan?: string;
    tanggal: string | Date;
}