import { PrismaService } from "src/prisma.service";
import { product } from "./product.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class productService {
    constructor(private prisma:PrismaService){};

    // get all produk
    async getAllProduct(): Promise<product[]>{
        return this.prisma.product.findMany()
    }

    // create produk
    async createProduct(data: product):Promise<product>{
        return this.prisma.product.create({
            data,
        })
    }

    // update produk (keuntungan)
    async updateBarang(id_product:number, data: product): Promise<product>{
        const hargaJual = data.harga_product + data.keuntungan;
        
        return this.prisma.product.update({
            where: {id_product:Number(id_product)},
            data:{
                harga_product: data.harga_product,
                keuntungan: data.keuntungan,
                hargaJual: hargaJual,
            }
        })
    }

    // delete barang
    async deleteProduct(id_product:number):Promise<product>{
        return this.prisma.product.delete({
            where:{id_product:Number(id_product)}
        })
    }

    // total barang yang ada
    async sumTotalStock(): Promise<number> {
        const totalStock = await this.prisma.product.aggregate({
            _sum: { stok_product: true }
        });

        return totalStock._sum.stok_product || 0;
    }
}