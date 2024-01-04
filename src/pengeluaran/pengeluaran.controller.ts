import { Controller, Post, Body, Param, Get, NotFoundException } from '@nestjs/common';
import { PengeluaranService } from './pengeluaran.service';

@Controller('api/v1/pengeluaran')
export class PengeluaranController {
  constructor(private readonly pengeluaranService: PengeluaranService) {}

  @Post('create')
  async createPengeluaran(@Body() data: { jumlah: number; keterangan: string; tanggal: Date; idPendapatan: number }) {
    try {
      const createdPengeluaran = await this.pengeluaranService.createPengeluaran(data);
      return createdPengeluaran;
    } catch (error) {
      console.error('Error creating pengeluaran:', error);
      throw error;
    }
  }

  // @Post('create-from-pendapatan/:idPendapatan')
  // async createPengeluaranFromPendapatan(@Param('idPendapatan') idPendapatan: number) {
  //   try {
  //     const createdPengeluaran = await this.pengeluaranService.createPengeluaranFromPendapatan(idPendapatan);
  //     return createdPengeluaran;
  //   } catch (error) {
  //     console.error('Error creating pengeluaran from pendapatan:', error);
  //     throw error;
  //   }
  // }

  @Get('total-per-day')
  async getTotalPengeluaranPerDay(@Param('date') date: string) {
    try {
      const totalPengeluaran = await this.pengeluaranService.getTotalPengeluaranPerDay();
      if (!totalPengeluaran || totalPengeluaran.length === 0) {
        throw new NotFoundException(`No expenditures found for date ${date}`);
      }
      return totalPengeluaran;
    } catch (error) {
      console.error('Error getting total pengeluaran per day:', error);
      throw error;
    }
  }
}
