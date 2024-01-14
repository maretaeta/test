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


// pendapatan perhari
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

    const mergedData: Record<string, any> = {};

    totalPembelianPerDay.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10);
      mergedData[date] = mergedData[date] || {};
      mergedData[date].totalPembelianPerDay = entry.totalPembelian_productSources;
    });

    totalPenjualanPerDay.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10);
      mergedData[date] = mergedData[date] || {};
      mergedData[date].totalPenjualanPerDay = entry.totalHarga_product;
    });

    totalPengeluaranPerDay.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10);
      mergedData[date] = mergedData[date] || {};
      mergedData[date].totalPengeluaranPerDay = entry.totalPengeluaran;
    });

    const dates = Object.keys(mergedData);

    const summary = await Promise.all(
      dates.map(async (date) => {
        const dailyPembelian = mergedData[date].totalPembelianPerDay || '0';
        const dailyPenjualan = mergedData[date].totalPenjualanPerDay || '0';
        const dailyPengeluaran = mergedData[date].totalPengeluaranPerDay || '0';

        const profits = await this.calculateProfit(totalPembelianPerDay, totalPenjualanPerDay);

        const profitValue = Number(profits.find((p) => p.date.toISOString().slice(0, 10) === date)?.value);
        const createdPendapatan = await this.prisma.pendapatan.create({
          data: {
            tanggal: new Date(date),
            totalPembelianPerDay: Number(dailyPembelian),
            totalPenjualanPerDay: Number(dailyPenjualan),
            totalPengeluaranPerDay: Number(dailyPengeluaran),
            totalKeuntunganPerDay: profitValue,
            pendapatanBersih: this.calculateNetIncome(
              Number(dailyPenjualan),
              Number(dailyPembelian),
              Number(dailyPengeluaran),
            ),
          },
        });

        const summaryEntry = {
          id_pendapatan: createdPendapatan.id_pendapatan,
          date: new Date(date),
          totalPembelianPerDay: dailyPembelian.toString(),
          totalPenjualanPerDay: dailyPenjualan.toString(),
          totalPengeluaranPerDay: dailyPengeluaran.toString(),
          totalKeuntunganPerDay: profits.find((p) => p.date.toISOString().slice(0, 10) === date)?.value || '0',
          pendapatanBersih: this.calculateNetIncome(
            Number(dailyPenjualan),
            Number(dailyPembelian),
            Number(dailyPengeluaran),
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



// Pendapatan Per Bulan
async calculateTotalPendapatanPerMonth(): Promise<any[]> {
  try {
    const totalSummary = await this.getSummary();

    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const monthlySummary: Record<string, { month: number; year: number; totalPendapatan: number }> = totalSummary.reduce(
      (acc, entry) => {
        const monthYearKey = entry.date.toLocaleDateString('en-US', { month: 'numeric', year: 'numeric' });
        const monthIndex = entry.date.getMonth();

        if (!acc[monthYearKey]) {
          acc[monthYearKey] = {
            month: monthIndex + 1,
            year: entry.date.getFullYear(),
            totalPendapatan: 0,
          };
        }

        acc[monthYearKey].totalPendapatan += entry.pendapatanBersih || 0;

        return acc;
      },
      {},
    );

    const result: { month: string; year: number; totalPendapatan: string }[] = Object.values(monthlySummary).map((entry) => ({
      month: monthNames[entry.month - 1],
      year: entry.year,
      totalPendapatan: entry.totalPendapatan.toFixed(),
    }));

    return result;
  } catch (error) {
    console.error('Error calculating total pendapatan per month:', error);
    throw error;
  }
}


// Pendapatan per tahun
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