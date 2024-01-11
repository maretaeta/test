// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get,Post, Param } from '@nestjs/common';
import { PendapatanService } from './pendapatan.service';

@Controller('api/v1/pendapatan')
export class PendapatanController {
  constructor(private readonly pendapatanService: PendapatanService) {}

// @Get('akumulasi')
// async hitungDanSimpanPendapatan(): Promise<{ success: boolean; message: string; createdPendapatan?: any }> {
//   try {
//     const akumulasi = await this.pendapatanService.hitungDanSimpanPendapatan();
//     return akumulasi;
//   } catch (error) {
//     return { success: false, message: `Error: ${error.message}` };
//   }
// }

// @Get('/automatic-summary')
//   async getAutomaticSummary(): Promise<any[]> {
//     try {
//       const summaries = await this.pendapatanService.getAutomaticSummary();
//       return summaries;
//     } catch (error) {
//       console.error('Error getting automatic summary:', error);
//       throw error;
//     }
//   }

// @Get('hitung-dan-simpan')
//   async hitungDanSimpanPendapatan(): Promise<{ success: boolean; message: string; createdPendapatan?: any }> {
//     try {
//       const result = await this.pendapatanService.hitungDanSimpanPendapatan();
//       return result;
//     } catch (error) {
//       return { success: false, message: `Error: ${error.message}` };
//     }
//   }

  //  @Get("summary")
  // async getSummary() {
  //   try {
  //     const summary = await this.pendapatanService.getSummary();
  //     return { success: true, data: summary };
  //   } catch (error) {
  //     return { success: false, message: `Error: ${error.message}` };
  //   }
  // }

  // @Get('bulanan')
  // async getAllMonthlySummary(): Promise<any[]> {
  //   try {
  //     const currentYear = new Date().getFullYear();
  //     const currentMonth = new Date().getMonth() + 1;

  //     const summary = await this.pendapatanService.calculateMonthlySummary(currentYear, currentMonth);
  //     return summary;
  //   } catch (error) {
  //     console.error('Error getting monthly summary:', error);
  //     throw error;
  //   }
  // }


}

// In PendapatanController.ts
// @Get('net-income-per-month')
// async getPendapatanBulanan(){
// try{
//   const pendapatanBulan = await this.pendapatanService.calculatePendapatanPerMonth();
//   return { success: true, data: pendapatanBulan };
// } catch(error){
//   return { success: false, message: `Error: ${error.message}` };




// @Get('per-month')
// async calculateNetIncomePerMonth(): Promise<{ month: number; netIncome: number }[]> {
//     try {
//         const netIncomes = await this.pendapatanService.calculateNetIncomePerMonth();
//         return netIncomes;
//     } catch (error) {
//         console.error('Error calculating net income per month:', error);
//         throw error;
//     }
// }


  // @Get('summary')
  // async getSummary(): Promise<any[]> {
  //   return this.pendapatanService.getSummary();
  // }


