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

@Put('edit/:id_pengeluaran')
async updatePengeluaran(@Param('id_pengeluaran') id_pengeluaran: number, @Body() data: pengeluaran): Promise<pengeluaran> {
  return this.pengeluaranService.updatePengeluaran(id_pengeluaran, data);
}


   @Delete('delete/:id_pengeluaran')
  async deletePengeluaran(@Param('id_pengeluaran') id_pengeluaran: number): Promise<{ message: string }> {
    try {
      const resultMessage = await this.pengeluaranService.deletePengeluaran(id_pengeluaran);
      return { message: resultMessage };
    } catch (error) {
      if (error instanceof NotFoundException) {
      
        throw new NotFoundException(error.message);
      }
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

  @Delete('/delete-akumulasi/:date')
  async deleteAccumulatedExpensesPerDay(@Param('date') date: string): Promise<string> {
    try {
      const parsedDate = new Date(date);

      // Check if the provided date is valid
      if (isNaN(parsedDate.getTime())) {
        throw new NotFoundException('Invalid date format. Please use "YYYY-MM-DD"');
      }

      const deletedMessage = await this.pengeluaranService.deleteAccumulatedExpensesPerDay(parsedDate);
      return deletedMessage;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('/delete-akumulasi/:id')
  async deleteAccumulatedExpenseById(@Param('id') id: string): Promise<string> {
    try {
      const entryId = parseInt(id, 10);

      // Check if the provided ID is a valid integer
      if (isNaN(entryId)) {
        throw new NotFoundException('Invalid entry ID. Please provide a valid integer.');
      }

      const deletedMessage = await this.pengeluaranService.deleteAccumulatedExpenseById(entryId);
      return deletedMessage;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}