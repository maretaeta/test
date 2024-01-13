// pendapatan.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { pendapatan } from './pendapatan.model';
import { PengeluaranService } from 'src/pengeluaran/pengeluaran.service';

@Injectable()
export class PendapatanService {
  calculateAndSaveIncomeData() {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService,
    private pengeluaranService: PengeluaranService) {}


 async calculateTotalPengeluaranPerDay(): Promise<any> {
    try {
      const results = await this.prisma.pengeluaran.groupBy({
        by: ['tanggal'],
        _sum: {
          jumlah: true,
        },
      });

      const mergedResult: Record<string, number> = {};
      results.forEach((result) => {
        const date = result.tanggal.toISOString().split('T')[0];
        mergedResult[date] = (mergedResult[date] || 0) + result._sum.jumlah;
      });

      const finalResult = Object.keys(mergedResult).map((date) => ({
        date: new Date(date),
        totalPengeluaran: mergedResult[date],
      }));

      return finalResult;
    } catch (error) {
      console.error('Error calculating total pengeluaran per day:', error);
      throw error;
    }
  }

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

calculateNetIncome(totalSales: number, totalPurchases: number, totalExpenses: number): number {
  return totalSales - totalPurchases - totalExpenses;
}


  async calculateProfit(totalPembelianPerDay: any[], totalPenjualanPerDay: any[]): Promise<{ date: Date; value: string }[]> {
    try {
      const profitPromises = totalPenjualanPerDay.map(async (sale) => {
        const purchase = totalPembelianPerDay.find(
          (p) => p.date.toISOString().split('T')[0] === sale.date.toISOString().split('T')[0],
        );

        if (purchase) {
          return {
            date: sale.date,
            value: (sale.totalHarga_product - purchase.totalPembelian_productSources).toString(),
          };
        }
      });

      const profits = await Promise.all(profitPromises);

      return profits.filter(Boolean);
    } catch (error) {
      console.error('Error calculating profit:', error);
      throw error;
    }
  }

  async getSummary(): Promise<any[]> {
    try {
      const totalPembelianPerDay = await this.calculateTotalPembelianPerDay();
      const totalPenjualanPerDay = await this.calculateTotalPenjualanPerDay();
      const totalPengeluaranPerDay = await this.calculateTotalPengeluaranPerDay();

      const dates = [
        ...new Set([
          ...totalPembelianPerDay.map((entry) => entry.date.toISOString().split('T')[0]),
          ...totalPenjualanPerDay.map((entry) => entry.date.toISOString().split('T')[0]),
          ...totalPengeluaranPerDay.map((entry) => entry.date.toISOString().split('T')[0]),
        ]),
      ];

      const summary = await Promise.all(
        dates.map(async (date) => {
          const dailyPembelian = totalPembelianPerDay.find((entry) => entry.date.toISOString().split('T')[0] === date);
          const dailyPenjualan = totalPenjualanPerDay.find((entry) => entry.date.toISOString().split('T')[0] === date);
          const dailyPengeluaran = totalPengeluaranPerDay.find(
            (entry) => entry.date.toISOString().split('T')[0] === date,
          );

          const profits = await this.calculateProfit(totalPembelianPerDay, totalPenjualanPerDay);

          const profitValue = Number(profits.find((p) => p.date.toISOString().split('T')[0] === date)?.value);
          const createdPendapatan = await this.prisma.pendapatan.create({
            data: {
              tanggal: new Date(date),
              totalPembelianPerDay: dailyPembelian?.totalPembelian_productSources,
              totalPenjualanPerDay: dailyPenjualan?.totalHarga_product,
              totalPengeluaranPerDay: dailyPengeluaran?.totalPengeluaran, 
              totalKeuntunganPerDay: profitValue,
              pendapatanBersih: this.calculateNetIncome(
                Number(dailyPenjualan?.totalHarga_product),
                Number(dailyPembelian?.totalPembelian_productSources),
                Number(dailyPengeluaran?.totalPengeluaran),  
              ),
            },
          });

          const summaryEntry = {
            id_pendapatan: createdPendapatan.id_pendapatan,
            date: new Date(date),
            totalPembelianPerDay: dailyPembelian ? dailyPembelian.totalPembelian_productSources.toString() : '0',
            totalPenjualanPerDay: dailyPenjualan ? dailyPenjualan.totalHarga_product.toString() : '0',
            totalPengeluaranPerDay: dailyPengeluaran ? dailyPengeluaran.totalPengeluaran.toString() : '0',  
            totalKeuntunganPerDay: profits.find((p) => p.date.toISOString().split('T')[0] === date)?.value || '0',
            pendapatanBersih: this.calculateNetIncome(
              Number(dailyPenjualan ? dailyPenjualan.totalHarga_product : 0),
              Number(dailyPembelian ? dailyPembelian.totalPembelian_productSources : 0),
              Number(dailyPengeluaran ? dailyPengeluaran.totalPengeluaran : 0),  
            ),
          };

          return summaryEntry;
        }),
      );

      return summary;
    } catch (error) {
      console.error('Error getting summary:', error);
      throw error;
    }
  }


  async calculateTotalPendapatanPerMonth(): Promise<any[]> {
  try {
    const totalSummary = await this.getSummary();

    const monthlySummary: Record<string, { month: number; year: number; totalPendapatan: number }> = totalSummary.reduce(
      (acc, entry) => {
        const monthYearKey = entry.date.toLocaleDateString('en-US', { month: 'numeric', year: 'numeric' });

        if (!acc[monthYearKey]) {
          acc[monthYearKey] = {
            month: entry.date.getMonth() + 1,
            year: entry.date.getFullYear(),
            totalPendapatan: 0,
          };
        }

        acc[monthYearKey].totalPendapatan += entry.pendapatanBersih || 0;

        return acc;
      },
      {},
    );

    const result: { month: number; year: number; totalPendapatan: string }[] = Object.values(monthlySummary).map((entry) => ({
      month: entry.month,
      year: entry.year,
      totalPendapatan: entry.totalPendapatan.toFixed(), 
    }));

    return result;
  } catch (error) {
    console.error('Error calculating total pendapatan per month:', error);
    throw error;
  }
}

async calculateAccumulatedNetIncome(): Promise<{ year: number; total: number }[]> {
    try {
      const summary = await this.getSummary();

      const accumulatedNetIncomePerYear: Record<number, number> = {};

      summary.forEach((entry) => {
        const year = entry.date.getFullYear();
        accumulatedNetIncomePerYear[year] = (accumulatedNetIncomePerYear[year] || 0) + entry.pendapatanBersih;
      });

      const result: { year: number; total: number }[] = Object.entries(accumulatedNetIncomePerYear).map(([year, total]) => ({
        year: parseInt(year, 10),
        total,
      }));

      return result;
    } catch (error) {
      console.error('Error calculating accumulated net income:', error);
      throw error;
    }
  }
}