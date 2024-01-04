import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PengeluaranService } from 'src/pengeluaran/pengeluaran.service';

@Injectable()
export class PendapatanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pengeluaranService: PengeluaranService,
  ) {}

  // total pembelian perhari
  async calculateTotalPembelianPerDay(): Promise<any> {
    const result = await this.prisma.productSources.groupBy({
      by: ['createdAt'],
      _sum: {
        totalPembelian_productSources: true,
      },
    });

    const mergedResult: Record<string, number> = {};
    result.forEach((entry) => {
      const date = entry.createdAt.toISOString().split('T')[0];
      mergedResult[date] = (mergedResult[date] || 0) + entry._sum.totalPembelian_productSources;
    });

    const finalResult = Object.keys(mergedResult).map((date) => ({
      date: new Date(date),
      totalPembelian_productSources: mergedResult[date],
    }));

    return finalResult;
  }



  // total penjualan perhari
  async calculateTotalPenjualanPerDay(): Promise<any> {
    const result = await this.prisma.penjualan.groupBy({
      by: ['createdAt'],
      _sum: {
        totalHarga_product: true,
      },
    });

    const mergedResult: Record<string, number> = {};
    result.forEach((entry) => {
      const date = entry.createdAt.toISOString().split('T')[0];
      mergedResult[date] = (mergedResult[date] || 0) + entry._sum.totalHarga_product;
    });

    const finalResult = Object.keys(mergedResult).map((date) => ({
      date: new Date(date),
      totalHarga_product: mergedResult[date],
    }));

    return finalResult;
  }


  // income
  calculateNetIncome(totalSales: number, totalPurchases: number, totalExpenses: number): number {
    return totalSales - totalPurchases - totalExpenses;
  }

  // total
async getSummary(): Promise<any[]> {
    try {
      const totalPembelianPerDay = await this.calculateTotalPembelianPerDay();
      const totalPenjualanPerDay = await this.calculateTotalPenjualanPerDay();
      const profits = await this.calculateProfit(totalPembelianPerDay, totalPenjualanPerDay);
      const expensesPerDay = await this.prisma.pengeluaran.groupBy({
        by: ['tanggal'],
        _sum: {
          jumlah: true,
        },
      });

      const dates = [
        ...new Set([
          ...totalPembelianPerDay.map((entry) => entry.date.toISOString().split('T')[0]),
          ...totalPenjualanPerDay.map((entry) => entry.date.toISOString().split('T')[0]),
        ]),
      ];

      const summary = await Promise.all(dates.map(async (date) => {
        const dailyPembelian = totalPembelianPerDay.find((entry) => entry.date.toISOString().split('T')[0] === date);
        const dailyPenjualan = totalPenjualanPerDay.find((entry) => entry.date.toISOString().split('T')[0] === date);
        const dailyExpenses = expensesPerDay.find((entry) => entry.tanggal.toISOString().split('T')[0] === date) as { _sum: { jumlah: number } } | undefined;

        // Create a new Pendapatan record
        const createdPendapatan = await this.prisma.pendapatan.create({
          data: {
            tanggal: new Date(date),
          },
        });

        const summaryEntry = {
          id_pendapatan: createdPendapatan.id_pendapatan,
          date: new Date(date),
          totalPembelianPerDay: dailyPembelian ? dailyPembelian.totalPembelian_productSources : 0,
          totalPenjualanPerDay: dailyPenjualan ? dailyPenjualan.totalHarga_product : 0,
          totalKeuntunganPerDay: profits.find((p) => p.date.toISOString().split('T')[0] === date)?.value || 0,
          pengeluaranPerDay: dailyExpenses ? dailyExpenses._sum.jumlah : 0,
          pendapatanBersih: this.calculateNetIncome(
            dailyPenjualan ? dailyPenjualan.totalHarga_product : 0,
            dailyPembelian ? dailyPembelian.totalPembelian_productSources : 0,
            dailyExpenses ? dailyExpenses._sum.jumlah : 0,
          ),
        };

        return summaryEntry;
      }));

      return summary;
    } catch (error) {
      console.error('Error getting summary:', error);
      throw error;
    }
  }

  // keuntungan
 async calculateProfit(
    totalPembelianPerDay: any[],
    totalPenjualanPerDay: any[],
  ): Promise<{ date: Date; value: number }[]> {
    try {
      const profits: { date: Date; value: number }[] = [];

      totalPenjualanPerDay.forEach((sale) => {
        const purchase = totalPembelianPerDay.find(
          (p) => p.date.toISOString().split('T')[0] === sale.date.toISOString().split('T')[0],
        );

        if (purchase) {
          const profit = {
            date: sale.date,
            value: sale.totalHarga_product - purchase.totalPembelian_productSources,
          };

          profits.push(profit);
        }
      });

      return profits;
    } catch (error) {
      console.error('Error calculating profit:', error);
      throw error;
    }
  }
}