
import { Module } from '@nestjs/common';
import { PendapatanController } from "./pendapatan.controller"
import { PendapatanService } from './pendapatan.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PendapatanController],
  providers: [PendapatanService, PrismaService],
})
export class pendapatanModule{}
