import { PrismaService } from "src/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductSources } from "./productSources.model";
import { Prisma } from "@prisma/client";
import { monthNameToNumber } from "src/utils";


@Injectable()
export class ProductSourcesService {
    constructor(private prisma: PrismaService) {}

	// get data pembelian
	async getAllProductSources(): Promise<ProductSources[]> {
		const data  = await this.prisma.productSources.findMany({
			include: {
				product: {
					select: {
						id_product: true,
					},
				}, 
			},
			
		});

		return data;
	}

	// 
    async checkIfStoreExists(namatoko: string, alamat_toko: string): Promise<boolean> {
        const existingStore = await this.prisma.toko.findFirst({
            where: {
                namatoko,
                alamat_toko,
            },
        });
        return !!existingStore;
    }


	// Create pembelian
    async createProductSources(data: ProductSources): Promise<ProductSources> {

        let existingProduct = await this.prisma.product.findFirst({
            where: {
                jenis_product: data.jenis_productSources,
                nama_product: data.nama_productSources,
                ukuran_product: data.ukuran_productSources,
            },
        });

        if (existingProduct) {
            await this.prisma.product.update({
                where: { id_product: existingProduct.id_product },
                data: {
                    stok_product: {
                        increment: Number(data.jumlah_productSources),
                    },
                },
            });
        } else {
            const totalHarga = this.calculateTotalHarga(data.jumlah_productSources, data.pembelian_productSources, data.ongkosProses_productSources);
            const harga = totalHarga / data.jumlah_productSources / 3;

            const newProduct = await this.prisma.product.create({
                data: {
                    jenis_product: data.jenis_productSources,
                    nama_product: data.nama_productSources,
                    ukuran_product: data.ukuran_productSources,
                    stok_product: Number(data.jumlah_productSources),
                    harga_product: harga,
                },
            
            });

            existingProduct = newProduct;
        }

        const storeExists = await this.checkIfStoreExists(data.nama_toko, data.alamat_toko);

        if (!storeExists) {
            await this.prisma.toko.create({
                data: {
                    namatoko: data.nama_toko,
                    alamat_toko: data.alamat_toko,
                },
            });
        }

        const totalHarga = this.calculateTotalHarga(data.jumlah_productSources, data.pembelian_productSources, data.ongkosProses_productSources);
        const harga = totalHarga / data.jumlah_productSources / 3;

        const prismaData: Prisma.ProductSourcesCreateInput = {
            nama_toko: data.nama_toko,
            alamat_toko: data.alamat_toko,
            jenis_productSources: data.jenis_productSources,
            nama_productSources: data.nama_productSources,
            ukuran_productSources: data.ukuran_productSources,
            satuan_productSources: data.satuan_productSources,
            jumlah_productSources: Number(data.jumlah_productSources),
            pembelian_productSources: Number(data.pembelian_productSources),
            ongkosProses_productSources: Number(data.ongkosProses_productSources),
            totalPembelian_productSources: Number(totalHarga),
            hargaPerLembar: harga,
            product: {
                connect: { id_product: existingProduct.id_product },
            },
        };

        return this.prisma.productSources.create({
            data: prismaData,
        });
    }


    // Update pembelian barang
    async updateProductSource(id_productSources: number, data: ProductSources): Promise<ProductSources | null> {
     try {
        const existingProductSource = await this.prisma.productSources.findUnique({     
            where: {
                id_productSources:Number(id_productSources)
            }
        });

        if (!existingProductSource) {
            return null;
        }

        const totalHarga = this.calculateTotalHarga(data.jumlah_productSources, data.pembelian_productSources, data.ongkosProses_productSources);
        const hargaPerLembar = totalHarga / data.jumlah_productSources / 3;

        let existingProduct = await this.prisma.product.findFirst({
            where: {
                jenis_product: data.jenis_productSources,
                nama_product: data.nama_productSources,
                ukuran_product: data.ukuran_productSources,
            },
        });

        if (!existingProduct) {
            const newProduct = await this.prisma.product.create({
                data: {
                    jenis_product: data.jenis_productSources,
                    nama_product: data.nama_productSources,
                    ukuran_product: data.ukuran_productSources,
                    stok_product: data.jumlah_productSources - existingProductSource.jumlah_productSources,
                    harga_product: hargaPerLembar,
                },
            });
            existingProduct = newProduct;
        } else {
            await this.prisma.product.update({
                where: { id_product: existingProduct.id_product },
                data: {
                    stok_product: {
                        increment: data.jumlah_productSources - existingProductSource.jumlah_productSources,
                    },
                    harga_product: hargaPerLembar,
                },
            });
        }

        const updatedProductSource = await this.prisma.productSources.update({
            where: { id_productSources:Number(id_productSources) },
            data: {
                nama_toko: data.nama_toko,
                alamat_toko: data.alamat_toko,
                jenis_productSources: data.jenis_productSources,
                nama_productSources: data.nama_productSources,
                ukuran_productSources: data.ukuran_productSources,
                satuan_productSources: data.satuan_productSources,
                jumlah_productSources: data.jumlah_productSources,
                pembelian_productSources: data.pembelian_productSources,
                ongkosProses_productSources: data.ongkosProses_productSources,
                totalPembelian_productSources: totalHarga,
                hargaPerLembar,
                product: {
                    connect: { id_product: existingProduct.id_product },
                },
            },
        });

        return updatedProductSource;
    } catch (error) {
        throw error;
    }
}

    // Delete pembelian barang
    async deleteProductSources(id_productSources: number): Promise<ProductSources> {
        return this.prisma.productSources.delete({
            where:{id_productSources:Number(id_productSources)}
        })
    }


    private calculateTotalHarga(jumlah: number, harga: number, ongkosProses: number): number {
        return harga + ongkosProses;
    }


	// Total semua barang yang dibeli
    async TotalProductSources(monthName: string): Promise<{month: string; total: number}> {
        if (!monthName) {
            throw new Error('Month name is required');
        }

        const monthNumber = monthNameToNumber(monthName);

        if (monthNumber === -1) {
            throw new Error(`Invalid month name: ${monthName}`);
        }

        const totalStock = await this.prisma.productSources.aggregate({
            _sum: { jumlah_productSources: true },
            where: {
                AND: [
                    { createdAt: { gte: new Date(2023, monthNumber - 1, 1) } } as any,
                    { createdAt: { lt: new Date(2023, monthNumber, 1) } } as any,
                ],
            },
        });

        const total = totalStock._sum.jumlah_productSources || 0;

        return { month: monthName, total };
    }


    // Data Perbulan Di tahun tersebut
    async getPembelianByBulanTahun(bulan: number, tahun: number): Promise<ProductSources[]> {
        const startDate = new Date(tahun, bulan - 1, 1);
        const endDate = new Date(tahun, bulan, 1);


    const data = await this.prisma.productSources.findMany({
        where: {
        createdAt: {
            gte: startDate,
            lte: endDate,
        },
        },
        include: {
        product: {
            select: {
            id_product: true,
            },
        },
        },
    });

        return data;
    }

    // Filter Grafik Pendapattan
    async getSalesByYear(year: number): Promise<number[]> {
        const salesData = [];
        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);

            const salesForMonth = await this.prisma.productSources.aggregate({
                _sum: { totalPembelian_productSources: true },
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });

            salesData.push(salesForMonth._sum.totalPembelian_productSources || 0);
        }

        return salesData;
    }   

    // Filter berdasarkan Jenis kayu
    async filterProductSourcesByWoodType(jenisKayu: string): Promise<ProductSources[]> {
        try {
        const filteredData = await this.prisma.productSources.findMany({
            where: {
            jenis_productSources: jenisKayu,
            },
            include: {
            product: {
                select: {
                id_product: true,
                },
            },
            },
        });

        return filteredData;
        } catch (error) {
        console.error('Error filtering products by wood type:', error);
        throw new NotFoundException('Products not found for the given wood type');
        }
    }

    // Filter berdasarkan Date Range
    async getProductsInDateRange(dateRange: { start: Date; end: Date }): Promise<ProductSources[]> {
        const { start, end } = dateRange;

        try {
            const filterData = await this.prisma.productSources.findMany({
                where: {
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
            });

            return filterData;
        } catch (error) {
            console.error('Error fetching products in date range:', error);
            throw new Error('Error fetching products in date range');
        }
    }
}



