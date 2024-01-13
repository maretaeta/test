import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException} from '@nestjs/common';
import { PengeluaranService } from './pengeluaran.service';
import { pengeluaran } from './pengeluaran.model';

@Controller('api/v1/pengeluaran')
export class PengeluaranController {
  constructor(private pengeluaranService: PengeluaranService) {}

  @Get()
  async getAllPengeluaran(): Promise<pengeluaran[]> {
    return this.pengeluaranService.getAllPengeluaran();
  }

  @Post('create')
  async createPengeluaran(@Body() data: pengeluaran): Promise<pengeluaran> {
    return this.pengeluaranService.createPengeluaran(data);
  }

  @Put('edit/:id')
  async updatePengeluaran(@Param('id') id: number, @Body() data: pengeluaran): Promise<pengeluaran> {
    return this.pengeluaranService.updatePengeluaran(id, data);
  }

   @Delete('delete/:id')
  async deletePengeluaran(@Param('id') id: number): Promise<{ message: string }> {
    try {
      const resultMessage = await this.pengeluaranService.deletePengeluaran(id);
      return { message: resultMessage };
    } catch (error) {
      if (error instanceof NotFoundException) {
      
        throw new NotFoundException(error.message);
      }
      // Handle other exceptions with a generic HTTP status code
      throw new Error(error.message);
    }
  }

  @Get('search')
  async searchPengeluaran(@Query('keyword') keyword: string): Promise<any[]> {
    return this.pengeluaranService.searchPengeluaran(keyword);
  }


   @Get('accumulated-expenses-per-day')
  async getAccumulatedExpensesPerDay(): Promise<{ date: Date; total: number }[]> {
    try {
      return this.pengeluaranService.getAccumulatedExpensesPerDay();
    } catch (error) {
      throw new Error(`Failed to get accumulated expenses per day: ${error.message}`);
    }
  }
}
