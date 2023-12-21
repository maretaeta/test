    import { PrismaService } from "src/prisma.service";
    import { product } from "./product.model";
    import { Injectable } from "@nestjs/common";
    import { monthNameToNumber } from "src/utils";
    
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
        async deleteProduct(id_product: number): Promise<product> {
        try {
            const productSourcesExists = await this.prisma.productSources.findMany({
                where: { id_product: Number(id_product) },
            });

            if (productSourcesExists.length > 0) {
                await this.prisma.productSources.deleteMany({
                    where: { id_product: Number(id_product) },
                });
            }

            // Check for PenjualanItem records referencing the product
            const penjualanItemsExists = await this.prisma.penjualanItem.findMany({
                where: { productId: Number(id_product) },
            });

            if (penjualanItemsExists.length > 0) {
                await this.prisma.penjualanItem.deleteMany({
                    where: { productId: Number(id_product) },
                });
            }

            return this.prisma.product.delete({
                where: { id_product: Number(id_product) },
            });
        } catch (error) {
            console.error(error);
            throw new Error('Failed to delete product or related records.');
        }
    }


    // total barang yang ada
    async sumTotalStockByMonth(monthName: string): Promise<{ month: string; total: number }> {
        if (!monthName) {
            throw new Error('Month name is required');
        }

        const monthNumber = monthNameToNumber(monthName);

        if (monthNumber === -1) {
            throw new Error(`Invalid month name: ${monthName}`);
        }

        const totalStock = await this.prisma.product.aggregate({
            _sum: { stok_product: true },
            where: {
                AND: [
                    { createdAt: { gte: new Date(2023, monthNumber - 1, 1) } } as any,
                    { createdAt: { lt: new Date(2023, monthNumber, 1) } } as any,
                ],
            },
        });

        const total = totalStock._sum.stok_product || 0;

        return { month: monthName, total };
    }
}