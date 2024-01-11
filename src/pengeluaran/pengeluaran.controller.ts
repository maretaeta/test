import { Controller, Get, Post, Body, Param, Delete,  NotFoundException, Put } from '@nestjs/common';
import { PengeluaranService } from './pengeluaran.service';
import { pengeluaran } from './pengeluaran.model';

@Controller('pengeluaran')
export class PengeluaranController {
  constructor(private readonly pengeluaranService: PengeluaranService) {}

  @Post()
  async createPengeluaran(@Body() data: pengeluaran): Promise<pengeluaran> {
    return this.pengeluaranService.createPengeluaran(data);
  }

  @Get()
  async getAllPengeluaran(): Promise<pengeluaran[]> {
    return this.pengeluaranService.searchPengeluaran(''); // Fetch all items
  }

  @Get('detail/:id_pengeluarab')
  async getPengeluaranById(@Param('id_pengeluaran') id_pengeluaran: number): Promise<pengeluaran> {
    const pengeluaran = await this.pengeluaranService.searchPengeluaran(id_pengeluaran.toString());
    if (!pengeluaran.length) {
      throw new NotFoundException(`Pengeluaran with ID ${id_pengeluaran} not found`);
    }
    return pengeluaran[0];
  }

  @Put('edit/:id')
  async updatePengeluaran(@Param('id') id_pengeluaran: number, @Body() data: pengeluaran): Promise<pengeluaran> {
    return this.pengeluaranService.updatePengeluaran(id_pengeluaran, data);
  }

  @Delete('delete/:id')
  async deletePengeluaran(@Param('id') id_pengeluaran: number): Promise<void> {
    await this.pengeluaranService.deletePengeluaran(id_pengeluaran);
  }
}
