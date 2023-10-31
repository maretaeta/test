import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ProductSourcesService } from "./productSources.service";
import { productSourcesController } from "./productSources.controller";



@Module({
    controllers: [productSourcesController],
    providers: [ProductSourcesService, PrismaService]
})

export class productSourcesModule{}