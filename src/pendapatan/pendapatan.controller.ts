import { Controller, Post, Body, ParseIntPipe } from "@nestjs/common";
import { PendapatanService } from "./pendapatan.service";
import { pendapatan } from "./pendapatan.model";

@Controller("api/v1/pendapatan")
export class PendapatanController {
  constructor(private readonly pendapatanService: PendapatanService) {}

  @Post("biaya-operasional")
  async inputBiayaOperasional(
    @Body("bensin") bensin: number,
    @Body("service") service: number,
    @Body("pembelian") pembelian: number,
    @Body("biayalain") biayalain: number,
    @Body("tanggal") tanggal: Date,
    @Body("userId") userId: number,
  ): Promise<pendapatan> {
    return this.pendapatanService.inputBiayaOperasional(
      bensin,
      service,
      pembelian,
      biayalain,
      tanggal,
      userId,
    );
  }

@Post("pendapatan-bulanan")
async hitungPendapatanBulanan(
  @Body("userId", ParseIntPipe) userId: number,
  @Body("bulan", ParseIntPipe) bulan: number,
  @Body("tahun", ParseIntPipe) tahun: number,

): Promise<number> {
  return this.pendapatanService.calculatePendapatanBulanan(userId, new Date(`${tahun}-${bulan}-01`));
}
}