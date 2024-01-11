import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PengeluaranService {
  constructor(private readonly prisma: PrismaService) {}

  async createPengeluaran(idPendapatan: number, expenses: any[]): Promise<any[]> {
    try {
      // Check if the corresponding Pendapatan exists
      const existingPendapatan = await this.prisma.pendapatan.findUnique({
        where: {
          id_pendapatan: idPendapatan,
        },
      });

      if (!existingPendapatan) {
        throw new NotFoundException(`Pendapatan with id ${idPendapatan} not found`);
      }

      const createdExpenses = await Promise.all(
        expenses.map(async (expense) => {
          const convertedJumlah = Number(expense.jumlah);

          const createdExpense = await this.prisma.pengeluaran.create({
            data: {
              jumlah: convertedJumlah,
              keterangan: expense.keterangan,
              tanggal: expense.tanggal,
              pendapatan: {
                connect: {
                  id_pendapatan: Number(idPendapatan),
                },
              },
            },
          });

          // Update totalPengeluaranPerDay and pengeluaranPerDay in Pendapatan
          await this.prisma.pendapatan.update({
            where: {
              id_pendapatan: Number(idPendapatan),
            },
            data: {
              totalPengeluaranPerDay: {
                increment: createdExpense.jumlah,
              },
              pengeluaranPerDay: {
                increment: 1,
              },
            },
          });

          return createdExpense;
        })
      );

      return createdExpenses;
    } catch (error) {
      console.error('Error creating expenses:', error);
      throw error; // Rethrow the error for the calling code to handle
    }
  }



  // async editPengeluaran(id: number, data: { jumlah?: number; keterangan?: string }): Promise<pengeluaran> {
  //   return this.prisma.pengeluaran.update({
  //     where: { id_pengeluaran: id },
  //     data,
  //   });
  // }


async getTotalPengeluaranPerDay(): Promise<any> {
  try {
    const result = await this.prisma.pengeluaran.groupBy({
      by: ['tanggal'],
      _sum: {
        jumlah: true,
      },
    });

    return result || []; 
  } catch (error) {
    console.error('Error getting total pengeluaran per day:', error);
    throw error;
  }
}


async deletePengeluaran(id: number): Promise<void> {
    try {
      const deletedPengeluaran = await this.prisma.pengeluaran.delete({
        where: { id_pengeluaran:Number (id) },
      });

      if (!deletedPengeluaran) {
        throw new NotFoundException(`Pengeluaran with id ${id} not found`);
      }

    } catch (error) {
      console.error('Error deleting pengeluaran:', error);
      throw error;
    }
  }

}