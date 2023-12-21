import { Prisma } from "@prisma/client";

export class pendapatan implements Prisma.PendapatanCreateInput{
    id_pendapatan: number;
    jumlah: number;
    tanggal: string | Date;
    keterangan?: string;
    tahun: number;
}