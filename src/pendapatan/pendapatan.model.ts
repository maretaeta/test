import { Prisma } from "@prisma/client";

export class pendapatan implements Prisma.PendapatanCreateInput{
    id_pendapatan: number;
    tanggal: Date;
    totalPembelianPerDay?: number;
    totalPenjualanPerDay?: number;
    totalKeuntunganPerDay?: number;
    totalPengeluaranPerDay?: number;
    pengeluaranPerDay?: number;
    pendapatanBersih?: number;    
    totalPendapatanPerMonth?: number;
    totalPendapatanPerYears?: number;
}