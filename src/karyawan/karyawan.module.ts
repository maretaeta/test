import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { karyawanService } from "./karyawan.service";
import { karyawanController } from "./karyawan.controller";

@Module({
    controllers:[karyawanController],
    providers:[karyawanService, PrismaService]
})

export class KaryawanModule{}