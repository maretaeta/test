// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get,Post, Param } from '@nestjs/common';
import { PendapatanService } from './pendapatan.service';

@Controller('api/v1/pendapatan')
export class PendapatanController {
  constructor(private readonly pendapatanService: PendapatanService) {}


  // pendapatan perhari
   @Get('/summary')
  async getSummary(): Promise<any[]> {
    try {
      return await this.pendapatanService.getSummary();
    } catch (error) {
      console.error('Error in PendapatanController - getSummary:', error);
      throw error;
    }
  }

  // pendapatan perbulan
   @Get('/total-per-month')
  async calculateTotalPendapatanPerMonth(): Promise<any[]> {
    try {
      const totalPendapatanPerMonth = await this.pendapatanService.calculateTotalPendapatanPerMonth();
      return totalPendapatanPerMonth;
    } catch (error) {
      console.error('Error in calculateTotalPendapatanPerMonth controller:', error);
      throw error;
    }
  }

  // pendapatan per tahun
   @Get('tahun')
  async getAccumulatedNetIncome(): Promise<{ year: number; total: number }[]> {
    try {
      const accumulatedNetIncome = await this.pendapatanService.calculateAccumulatedNetIncome();
      return accumulatedNetIncome;
    } catch (error) {
      console.error('Error getting accumulated net income:', error);
      throw error;
    }
  }
}

 