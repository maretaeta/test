import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { penjualanService } from "./penjualan.service";
import { penjualanController } from "./penjualan.controller";


@Module ({
    controllers:[penjualanController],
    providers: [penjualanService, PrismaService]
})

export class PenjualanModule{}