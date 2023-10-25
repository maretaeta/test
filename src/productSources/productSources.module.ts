import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { productSourcesService } from "./productSources.service";
import { productSourcesController } from "./productSources.controller";



@Module({
    controllers: [productSourcesController],
    providers: [productSourcesService, PrismaService]
})

export class productSourcesModule{}