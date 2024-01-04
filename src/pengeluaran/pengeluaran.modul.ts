import { Module } from '@nestjs/common';
import { PengeluaranController } from './pengeluaran.controller';
import { PengeluaranService } from './pengeluaran.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PengeluaranController],
  providers: [PengeluaranService, PrismaService],
})
export class PengeluaranModule {}
