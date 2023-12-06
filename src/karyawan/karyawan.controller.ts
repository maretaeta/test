import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { karyawanService } from './karyawan.service';
import { karyawan } from './karyawan.model';

@Controller('api/v1/karyawan')
export class karyawanController {
  constructor(private readonly karyawanService: karyawanService) {}

  @Get()
  async getAllKaryawan(): Promise<karyawan[]> {
    return this.karyawanService.getAllKaryawan();
  }

  @Get('detail/:id_karyawan')
  async getKaryawanById(@Param('id_karyawan') id_karyawan: number): Promise<karyawan> {
    return this.karyawanService.getKaryawanById(id_karyawan);
  }

  @Post('create')
  async createKaryawan(@Body() data: karyawan): Promise<karyawan> {
    return this.karyawanService.createKaryawan(data);
  }

  @Put('edit/:id_karyawan')
  async updateKaryawan(@Param('id_karyawan') id_karyawan: number, @Body() data: karyawan): Promise<karyawan> {
    return this.karyawanService.updateKaryawan(id_karyawan, data);
  }

  @Delete('delete/:id_karyawan')
  async deleteKaryawan(@Param('id_karyawan') id_karyawan: number): Promise<string | { error: string; message: string }> {
    try {
      await this.karyawanService.deleteKaryawan(id_karyawan);
      return "Karyawan Deleted";
    } catch (error) {
      console.error(error);
      return {
        error: "Internal Server Error",
        message: "An error occurred while deleting the penjualan.",
      };
    }
  }
}
