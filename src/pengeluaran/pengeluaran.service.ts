// src/pengeluaran/pengeluaran.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { pengeluaran } from "./pengeluaran.model"

@Injectable()
export class PengeluaranService {
  constructor(private readonly prisma: PrismaService) {}

   async createPengeluaran(data: {
    jumlah: number;
    keterangan: string;
    tanggal: Date;
    idPendapatan: number;
  }): Promise<pengeluaran> {
    try {
      const pendapatan = await this.prisma.pendapatan.findUnique({
        where: { id_pendapatan: Number(data.idPendapatan) },
      });

      if (!pendapatan) {
        throw new NotFoundException(`Pendapatan with id ${data.idPendapatan} not found`);
      }

      const pengeluaranData = {
        jumlah: data.jumlah,
        keterangan: data.keterangan,
        tanggal: data.tanggal,
        pendapatanId: data.idPendapatan,
      };

      const createdPengeluaran = await this.prisma.pengeluaran.create({ data: pengeluaranData });

      return createdPengeluaran;
    } catch (error) {
      console.error('Error creating pengeluaran:', error);
      throw error;
    }
  }


  async editPengeluaran(id: number, data: { jumlah?: number; keterangan?: string }): Promise<pengeluaran> {
    return this.prisma.pengeluaran.update({
      where: { id_pengeluaran: id },
      data,
    });
  }


async getTotalPengeluaranPerDay(): Promise<any> {
  try {
    const result = await this.prisma.pengeluaran.groupBy({
      by: ['tanggal'],
      _sum: {
        jumlah: true,
      },
      // where: {
      //   tanggal: new Date(date),
      // },
    });

    return result || []; 
  } catch (error) {
    console.error('Error getting total pengeluaran per day:', error);
    throw error;
  }
}



  //  async createPengeluaranFromPendapatan(idPendapatan: number): Promise<pengeluaran> {
  //   try {
  //     const pendapatan: pendapatan | null = await this.prisma.pendapatan.findUnique({
  //       where: { id_pendapatan: Number (idPendapatan) },
  //     });

  //     if (!pendapatan) {
  //       throw new NotFoundException(`Pendapatan with id ${idPendapatan} not found`);
  //     }

  //     const pengeluaranData = {
  //       jumlah: pendapatan.jumlah,
  //       keterangan: pendapatan.keterangan,
  //       tanggal: pendapatan.tanggal,
  //     };

  //     const createdPengeluaran = await this.prisma.pengeluaran.create({ data: pengeluaranData });

  //     await this.prisma.pendapatan.delete({
  //       where: { id_pendapatan:Number (idPendapatan) },
  //     });

  //     return createdPengeluaran;
  //   } catch (error) {
  //     console.error('Error creating pengeluaran from pendapatan:', error);
  //     throw error;
  //   }
  // }
}