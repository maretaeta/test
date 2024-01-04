import { Controller, Get } from '@nestjs/common';
import { PendapatanService } from './pendapatan.service';

@Controller('api/v1/pendapatan')
export class PendapatanController {
  constructor(private readonly pendapatanService: PendapatanService) {}

  @Get('/summary')
  async getSummary(): Promise<any> {
    const summary = await this.pendapatanService.getSummary();
    return summary;
  }

  @Get('totalPembelianPerDay')
  async getTotalPembelianPerDay() {
    return this.pendapatanService.calculateTotalPembelianPerDay();
  }

  @Get('totalPenjualanPerDay')
  async getTotalPenjualanPerDay() {
    return this.pendapatanService.calculateTotalPenjualanPerDay();
  }

  @Get('profit')
  async getProfit(): Promise<{ profit: any[] }> {
    const totalPembelianPerDay = await this.pendapatanService.calculateTotalPembelianPerDay();
    const totalPenjualanPerDay = await this.pendapatanService.calculateTotalPenjualanPerDay();

    return { profit: await this.pendapatanService.calculateProfit(totalPembelianPerDay, totalPenjualanPerDay) };
  }
}

  // @Get('penjualanWithPengeluaran')
  // async getPenjualanWithPengeluaran() {
  //   return this.pendapatanService.getPenjualanWithPengeluaran();
  // }
