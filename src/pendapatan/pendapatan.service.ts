// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
// import { PengeluaranService } from 'src/pengeluaran/pengeluaran.service';

// @Injectable()
// export class PendapatanService {
//     private dateToIdMapping: Record<string, number> = {};

//     constructor(
//         private readonly prisma: PrismaService,
//         private readonly pengeluaranService: PengeluaranService,
//     ) {}

//     async getTotalPembelianPerDay(date: Date): Promise<number> {
//         const totalPembelian = await this.prisma.productSources.aggregate({
//             _sum: {
//                 pembelian_productSources: true,
//             },
//             where: {
//                 createdAt: {
//                     gte: date,
//                     lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
//                 },
//             },  
//         });

//         return totalPembelian._sum?.pembelian_productSources || 0;
//     }

//     async getTotalPenjualanPerDay(date: Date): Promise<number> {
//         const totalPenjualan = await this.prisma.penjualan.aggregate({
//             _sum: {
//                 totalHarga_product: true,
//             },
//             where: {
//                 createdAt: {
//                     gte: date,
//                     lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
//                 },
//             },
//         });

//         return totalPenjualan._sum?.totalHarga_product || 0;
//     }

//     async getKeuntunganPerDay(date: Date): Promise<number> {
//         const totalPembelian = await this.getTotalPembelianPerDay(date);
//         const totalPenjualan = await this.getTotalPenjualanPerDay(date);

//         return totalPembelian - totalPenjualan;
//     }

//     async getSummaryPerDay(date: Date): Promise<{
//         totalPembelianPerDay: number;
//         totalPenjualanPerDay: number;
//         totalKeuntunganPerDay: number;
//     }> {
//         const totalPembelianPerDay = await this.getTotalPembelianPerDay(date);
//         const totalPenjualanPerDay = await this.getTotalPenjualanPerDay(date);
//         const totalKeuntunganPerDay = await this.getKeuntunganPerDay(date);

//         return {
//             totalPembelianPerDay,
//             totalPenjualanPerDay,
//             totalKeuntunganPerDay,
//         };
//     }

//   async getSummaryPerYear(year: number): Promise<any> {
//     const startDate = new Date(year, 0, 1);
//     const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

//     const totalPembelianPerYear = await this.prisma.productSources.aggregate({
//       _sum: {
//         pembelian_productSources: true,
//       },
//       where: {
//         createdAt: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//     });

//     const totalPenjualanPerYear = await this.prisma.penjualan.aggregate({
//       _sum: {
//         totalHarga_product: true,
//       },
//       where: {
//         createdAt: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//     });

//     const totalKeuntunganPerYear =
//       totalPembelianPerYear._sum?.pembelian_productSources || 0 -
//       totalPenjualanPerYear._sum?.totalHarga_product ||
//       0;

//     return {
//       totalPembelianPerYear: totalPembelianPerYear._sum?.pembelian_productSources || 0,
//       totalPenjualanPerYear: totalPenjualanPerYear._sum?.totalHarga_product || 0,
//       totalKeuntunganPerYear,
//     };
//   }
// }


import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PengeluaranService } from 'src/pengeluaran/pengeluaran.service';

@Injectable()
export class PendapatanService {

  private dateToIdMapping: Record<string, number> = {};

  constructor(
    private readonly prisma: PrismaService,
    private readonly pengeluaranService: PengeluaranService,
  ) {}

  // total pembelian perhari
//   async calculateTotalPembelianPerDay(): Promise<any> {
//     const result = await this.prisma.productSources.groupBy({
//       by: ['createdAt'],
//       _sum: {
//         totalPembelian_productSources: true,
//       },
//     });

//     const mergedResult: Record<string, number> = {};
//     result.forEach((entry) => {
//       const date = entry.createdAt.toISOString().split('T')[0];
//       mergedResult[date] = (mergedResult[date] || 0) + entry._sum.totalPembelian_productSources;
//     });

//     const finalResult = Object.keys(mergedResult).map((date) => ({
//       date: new Date(date),
//       totalPembelian_productSources: mergedResult[date],
//     }));

//     return finalResult;
//   }



//   // total penjualan perhari
//   async calculateTotalPenjualanPerDay(): Promise<any> {
//     const result = await this.prisma.penjualan.groupBy({
//       by: ['createdAt'],
//       _sum: {
//         totalHarga_product: true,
//       },
//     });

//     const mergedResult: Record<string, number> = {};
//     result.forEach((entry) => {
//       const date = entry.createdAt.toISOString().split('T')[0];
//       mergedResult[date] = (mergedResult[date] || 0) + entry._sum.totalHarga_product;
//     });

//     const finalResult = Object.keys(mergedResult).map((date) => ({
//       date: new Date(date),
//       totalHarga_product: mergedResult[date],
//     }));

//     return finalResult;
//   }


//   // income
//   calculateNetIncome(totalSales: number, totalPurchases: number, totalExpenses: number): number {
//     return totalSales - totalPurchases - totalExpenses;
//   }

//   // keuntungan
// async calculateProfit(
//   totalPembelianPerDay: any[],
//   totalPenjualanPerDay: any[],
// ): Promise<{ date: Date; value: string }[]> {
//   try {
//     const profits: { date: Date; value: string }[] = [];

//     totalPenjualanPerDay.forEach((sale) => {
//       const purchase = totalPembelianPerDay.find(
//         (p) => p.date.toISOString().split('T')[0] === sale.date.toISOString().split('T')[0],
//       );

//       if (purchase) {
//         const profit = {
//           date: sale.date,
//           value: (sale.totalHarga_product - purchase.totalPembelian_productSources).toString(),
//         };

//         profits.push(profit);
//       }
//     });

//     return profits;
//   } catch (error) {
//     console.error('Error calculating profit:', error);
//     throw error;
//   }
// }


// async getSummary(): Promise<any[]> {
//   try {
//     const totalPembelianPerDay = await this.calculateTotalPembelianPerDay();
//     const totalPenjualanPerDay = await this.calculateTotalPenjualanPerDay();

//     const expensesPerDay = await this.prisma.pengeluaran.groupBy({
//       by: ['tanggal'],
//       _sum: {
//         jumlah: true,
//       },
//     });

//     const dates = Array.from(new Set([
//       ...totalPembelianPerDay.map(entry => entry.date.toISOString().split('T')[0]),
//       ...totalPenjualanPerDay.map(entry => entry.date.toISOString().split('T')[0]),
//     ]));

//         const summary = await Promise.all(dates.map(async date => {
//             const dailyPembelian = totalPembelianPerDay.find(entry => entry.date.toISOString().split('T')[0] === date);
//             const dailyPenjualan = totalPenjualanPerDay.find(entry => entry.date.toISOString().split('T')[0] === date);
//             const profits = await this.calculateProfit(totalPembelianPerDay, totalPenjualanPerDay);
            
//             // Filter expenses for the current date
//             const filteredExpenses = expensesPerDay.filter(entry => entry.tanggal.toISOString().split('T')[0] === date);
//             const mappedExpensesPerDay = filteredExpenses.map(entry => ({
//                 tanggal: new Date(entry.tanggal),
//                 jumlah: entry._sum.jumlah,
//             }));

//             // Make sure 'date' is properly declared or initialized
//             const createdAt = dailyPembelian?.date || dailyPenjualan?.date || (filteredExpenses.length > 0 ? filteredExpenses[0].tanggal : new Date(date));

//             const createdPendapatan = await this.createPendapatanRecord(createdAt, dailyPembelian, dailyPenjualan, profits, mappedExpensesPerDay, date);

        

//            const summaryEntry = this.generateSummaryEntry(createdPendapatan, dailyPembelian, dailyPenjualan, profits, mappedExpensesPerDay, date, date); // Add date as the last argument


//             return summaryEntry;
//         }));

//         return summary;
//     } catch (error) {
//         console.error('Error getting summary:', error);
//         throw error;
//     }
// }


//     private async createPendapatanRecord(createdAt, dailyPembelian, dailyPenjualan, profits, dailyExpenses, date) {
//         // Create a new Pendapatan record
//         const createdPendapatan = await this.prisma.pendapatan.create({
//             data: {
//                 tanggal: createdAt,
//                 totalPembelianPerDay: dailyPembelian ? dailyPembelian.totalPembelian_productSources : 0,
//                 totalPenjualanPerDay: dailyPenjualan ? dailyPenjualan.totalHarga_product : 0,
//                 totalKeuntunganPerDay: Number(profits.find(p => p.date.toISOString().split('T')[0] === date)?.value) || 0,
//                 totalPengeluaranPerDay: dailyExpenses ? dailyExpenses._sum.jumlah : 0,
//                 pengeluaranPerDay: dailyExpenses ? dailyExpenses._sum.jumlah : 0,
//                 pendapatanBersih: this.calculateNetIncome(
//                     Number(dailyPenjualan ? dailyPenjualan.totalHarga_product : 0),
//                     Number(dailyPembelian ? dailyPembelian.totalPembelian_productSources : 0),
//                     Number(dailyExpenses ? dailyExpenses._sum.jumlah : 0),
//                 ),
//             },
//         });

        

//         const updatedPendapatan = await this.prisma.pendapatan.update({
//             where: { id_pendapatan: createdPendapatan.id_pendapatan },
//             data: {
//                 totalPengeluaranPerDay: createdPendapatan.totalPengeluaranPerDay + Number(dailyExpenses._sum.jumlah),
//                 pengeluaranPerDay: createdPendapatan.pengeluaranPerDay + Number(dailyExpenses._sum.jumlah),
//             },
//         });

//         // const expensesById = await this.pengeluaranService.createPengeluaran(updatedPendapatan.id_pendapatan, dailyExpenses || []);

//         return { ...updatedPendapatan};
//     }

// private generateSummaryEntry(createdPendapatan, dailyPembelian, dailyPenjualan, profits, dailyExpenses, expensesById, date) {
//     return {
//         id_pendapatan: createdPendapatan.id_pendapatan,
//         date: new Date(date),
//         totalPembelianPerDay: dailyPembelian ? dailyPembelian.totalPembelian_productSources.toString() : '0',
//         totalPenjualanPerDay: dailyPenjualan ? dailyPenjualan.totalHarga_product.toString() : '0',
//         totalKeuntunganPerDay: profits.find(p => p.date.toISOString().split('T')[0] === date)?.value || '0',
//         pengeluaranPerDay: dailyExpenses ? dailyExpenses._sum.jumlah.toString() : '0',
//         jumlah_pengeluaranPerDay: dailyExpenses ? dailyExpenses._sum.jumlah.toString() : '0',
//         pendapatanBersih: this.calculateNetIncome(
//             Number(dailyPenjualan ? dailyPenjualan.totalHarga_product : 0),
//             Number(dailyPembelian ? dailyPembelian.totalPembelian_productSources : 0),
//             Number(dailyExpenses ? dailyExpenses._sum.jumlah : 0),
//         ),
//         expensesDetails: expensesById,
//     };
//   }


}