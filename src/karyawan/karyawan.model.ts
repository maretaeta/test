import { Prisma } from "@prisma/client";

export class karyawan implements Prisma.KaryawanCreateInput{
    id_karyawan: number;
    nama_karyawan?: string;
    jabatan?: string;
    gaji?: number;
    tanggal_masuk?: string | Date;
}