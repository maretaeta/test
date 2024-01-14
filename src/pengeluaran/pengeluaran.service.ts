import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { pengeluaran } from './pengeluaran.model';

@Injectable()
export class PengeluaranService {
  constructor(private prisma: PrismaService) {}


 private isValidDate(date: string | Date): boolean {
    if (typeof date === 'string') {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return date.match(regex) !== null;
    } else {
      return date instanceof Date && !isNaN(date.getTime());
    }
  }

  private formatDateString(date: string | Date): Date {
    if (typeof date === 'string') {
      return new Date(date);
    } else {
      return date;
    }
  }

  async getAllPengeluaran(): Promise<pengeluaran[]> {
    return this.prisma.pengeluaran.findMany();
  }

  async createPengeluaran(data: pengeluaran): Promise<pengeluaran> {
    try {
      if (!this.isValidDate(data.tanggal)) {
        throw new BadRequestException('Invalid date format. Please use "YYYY-MM-DD"');
      }

      return this.prisma.pengeluaran.create({ 
        data: {
          tanggal: this.formatDateString(data.tanggal),
          jumlah: data.jumlah,
          keterangan: data.keterangan,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create Pengeluaran: ${error.message}`);
    }
  }

  async updatePengeluaran(id_pengeluaran: number, data: pengeluaran): Promise<pengeluaran> {
    try {
      if (!this.isValidDate(data.tanggal)) {
        throw new BadRequestException('Invalid date format. Please use "YYYY-MM-DD"');
      }

      const existingPengeluaran = await this.prisma.pengeluaran.findUnique({
        where: { id_pengeluaran: Number(id_pengeluaran) },
      });

      if (!existingPengeluaran) {
        throw new NotFoundException(`Pengeluaran with ID ${id_pengeluaran} not found`);
      }

      return this.prisma.pengeluaran.update({
        where: {
          id_pengeluaran: Number(id_pengeluaran),
        },
        data: {
          jumlah: data.jumlah,
          keterangan: data.keterangan,
          tanggal: this.formatDateString(data.tanggal),
        },
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

    return Promise.all(results.map(async (result) => {
      const accumulatedTotal = result._sum.jumlah;

      const details = await this.prisma.pengeluaran.findMany({
        where: {
          tanggal: result.tanggal,
        },
      });

      const combinedDetails = details.reduce((accumulator: pengeluaran[], currentDetail: pengeluaran) => {
        const existingDetail = accumulator.find((item) => item.keterangan === currentDetail.keterangan);

        if (existingDetail) {
          existingDetail.jumlah += currentDetail.jumlah;
        } else {
          accumulator.push({ ...currentDetail });
        }

        return accumulator;
      }, []);

      return {
        date: result.tanggal,
        total: accumulatedTotal,
        details: combinedDetails,
      };
    }));
  } catch (error) {
    throw new Error(`Failed to get accumulated expenses per day: ${error.message}`);
  }
}

 async deleteAccumulatedExpensesPerDay(date: Date): Promise<string> {
    try {
      const entriesToDelete = await this.prisma.pengeluaran.findMany({
        where: {
          tanggal: date,
        },
      });

      if (entriesToDelete.length === 0) {
        throw new NotFoundException(`No entries found for the date: ${date.toISOString()}`);
      }

      await Promise.all(entriesToDelete.map(async (entry) => {
        await this.prisma.pengeluaran.delete({
          where: { id_pengeluaran: entry.id_pengeluaran },
        });
      }));

      return `Accumulated expenses for the day ${date.toISOString()} have been deleted`;
    } catch (error) {
      throw new Error(`Failed to delete accumulated expenses per day: ${error.message}`);
    }
  }

  async deleteAccumulatedExpenseById(entryId: number): Promise<string> {
    try {
      const existingEntry = await this.prisma.pengeluaran.findUnique({
        where: { id_pengeluaran: entryId },
      });

      if (!existingEntry) {
        throw new NotFoundException(`Pengeluaran with ID ${entryId} not found`);
      }

      await this.prisma.pengeluaran.delete({
        where: { id_pengeluaran: entryId },
      });

      return `Pengeluaran with ID ${entryId} has been deleted`;
    } catch (error) {
      throw new Error(`Failed to delete Pengeluaran: ${error.message}`);
    }
  }
}

