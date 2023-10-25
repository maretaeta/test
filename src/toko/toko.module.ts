import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { tokoService } from "./toko.service";
import { tokoController } from "./toko.controller";



@Module({
    controllers: [tokoController],
    providers: [PrismaService, tokoService],
})

export class tokoModule{}