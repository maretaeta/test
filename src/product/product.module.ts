import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { productService } from "./product.service";
import { productController } from "./product.controller";


@Module ({
    controllers:[productController],
    providers: [productService, PrismaService]
})

export class ProductModule{}