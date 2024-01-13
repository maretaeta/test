
import { Module } from '@nestjs/common';
import { PendapatanController } from "./pendapatan.controller"
import { PendapatanService } from './pendapatan.service';
import { PrismaService } from 'src/prisma.service';
import { PengeluaranService } from 'src/pengeluaran/pengeluaran.service';

@Module({
  controllers: [PendapatanController],
  providers: [PendapatanService, PengeluaranService,PrismaService],
})
export class pendapatanModule{}
