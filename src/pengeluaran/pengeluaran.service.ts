import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { pengeluaran } from './pengeluaran.model';

@Injectable()
export class PengeluaranService {
  constructor(private prisma: PrismaService) {}

  async getAllPengeluaran(): Promise<pengeluaran[]> {
    return this.prisma.pengeluaran.findMany();
  }

  async createPengeluaran(data: pengeluaran): Promise<pengeluaran> {
  try {
    return this.prisma.pengeluaran.create({ 
      data: {
        tanggal: data.tanggal,
        jumlah: data.jumlah,
        keterangan: data.keterangan

    }
    });
  } catch (error) {
    throw new Error(`Failed to create Pengeluaran: ${error.message}`);
  }
}


  async updatePengeluaran(id_pengeluaran: number, data: pengeluaran): Promise<pengeluaran> {
    try {
      const existingPengeluaran = await this.prisma.pengeluaran.findUnique({
        where: { id_pengeluaran: Number(id_pengeluaran) },
      });

      if (!existingPengeluaran) {
        throw new NotFoundException(`Pengeluaran with ID ${id_pengeluaran} not found`);
      }

      return this.prisma.pengeluaran.update({
        where:{
          id_pengeluaran: Number(id_pengeluaran)
        },
        data:{
          jumlah: data.jumlah,
          keterangan: data.keterangan,
          tanggal: data.tanggal,
        }
      });
    } catch (error) {
      throw new Error(`Failed to update Pengeluaran: ${error.message}`);
    }
  }

  async deletePengeluaran(id_pengeluaran: number): Promise<string> {
    try {
      const existingPengeluaran = await this.prisma.pengeluaran.findUnique({
        where: { id_pengeluaran: Number(id_pengeluaran) },
      });

      if (!existingPengeluaran) {
        throw new NotFoundException(`Pengeluaran with ID ${id_pengeluaran} not found`);
      }

      await this.prisma.pengeluaran.delete({
        where: { id_pengeluaran: Number(id_pengeluaran) }
      });

      return `Pengeluaran with ID ${id_pengeluaran} has been deleted`;
    } catch (error) {
      throw new Error(`Failed to delete Pengeluaran: ${error.message}`);
    }
  }


  async searchPengeluaran(keyword: string): Promise<pengeluaran[]> {
    try {
      const results = await this.prisma.pengeluaran.findMany({
        where: {
          OR: [
            { keterangan: { contains: keyword, mode: "insensitive" } },
            { jumlah: { equals: parseInt(keyword, 10) || 0 } },
            // { tanggal: { equals: new Date(keyword, 10) } },
          ],
        },
      });

      if (results.length === 0) {
        throw new NotFoundException(`No Pengeluaran found with keyword: ${keyword}`);
      }

      return results;
    } catch (error) {
      throw new BadRequestException(`Invalid search parameter: ${keyword}`);
    }
  }

   async getAccumulatedExpensesPerDay(): Promise<{ date: Date; total: number; details: pengeluaran[] }[]> {
  try {
    const results = await this.prisma.pengeluaran.groupBy({
      by: ['tanggal'],
      _sum: {
        jumlah: true,
      },
    });

    return Promise.all(results.map(async (result) => ({
      date: result.tanggal,
      total: result._sum.jumlah,
      details: await this.prisma.pengeluaran.findMany({
        where: {
          tanggal: result.tanggal,
        },
      }),
    })));
  } catch (error) {
    throw new Error(`Failed to get accumulated expenses per day: ${error.message}`);
  }
}
  
}
