import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";
import { ProductSources } from "./productSources.model";
import { Prisma } from "@prisma/client";

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


	// buat pembelian
    async createProductSources(data: ProductSources): Promise<ProductSources> {
        // Cari data berdasarkan jenis, nama, dan ukuran produk
        let existingProduct = await this.prisma.product.findFirst({
            where: {
                jenis_product: data.jenis_productSources,
                nama_product: data.nama_productSources,
                ukuran_product: data.ukuran_productSources,
            },
        });

        // Jika produk dengan kombinasi tersebut sudah ada
        if (existingProduct) {
            // Tambahkan jumlahnya
            await this.prisma.product.update({
                where: { id_product: existingProduct.id_product },
                data: {
                    stok_product: {
                        increment: data.jumlah_productSources,
                    },
                },
            });
        } else {
            // Jika tidak ada, buat produk baru
            const totalHarga = this.calculateTotalHarga(data.jumlah_productSources, data.pembelian_productSources, data.ongkosProses_productSources);
            const harga = totalHarga / data.jumlah_productSources / 3;

            const newProduct = await this.prisma.product.create({
                data: {
                    jenis_product: data.jenis_productSources,
                    nama_product: data.nama_productSources,
                    ukuran_product: data.ukuran_productSources,
                    stok_product: data.jumlah_productSources,
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
            jumlah_productSources: data.jumlah_productSources,
            pembelian_productSources: data.pembelian_productSources,
            ongkosProses_productSources: data.ongkosProses_productSources,
            totalPembelian_productSources: totalHarga,
            hargaPerLembar: harga,
            product: {
                connect: { id_product: existingProduct.id_product },
            },
        };

        return this.prisma.productSources.create({
            data: prismaData,
        });
    }


async updateProductSource(id_productSources: number, data: ProductSources): Promise<ProductSources | null> {
    try {
        // Check if there's an existing product source with the specified id
        const existingProductSource = await this.prisma.productSources.findUnique({     
            where: {
                id_productSources: id_productSources, // Pass it as a number
            }
        });

        if (!existingProductSource) {
            return null;
        }

        // Calculate the new totalHarga and hargaPerLembar
        const totalHarga = this.calculateTotalHarga(data.jumlah_productSources, data.pembelian_productSources, data.ongkosProses_productSources);
        const hargaPerLembar = totalHarga / data.jumlah_productSources / 3;

        // Check if an associated product exists based on the specified criteria
        let existingProduct = await this.prisma.product.findFirst({
            where: {
                jenis_product: data.jenis_productSources,
                nama_product: data.nama_productSources,
                ukuran_product: data.ukuran_productSources,
            },
        });

        // If no associated product exists, create a new product
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
            // Update the associated product
            await this.prisma.product.update({
                where: { id_product: existingProduct.id_product },
                data: {
                    stok_product: {
                        // Increment the stok by the difference in jumlah
                        increment: data.jumlah_productSources - existingProductSource.jumlah_productSources,
                    },
                    harga_product: hargaPerLembar,
                },
            });
        }

        // Update the product source
        const updatedProductSource = await this.prisma.productSources.update({
            where: { id_productSources },
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

    async deleteProductSources(id_productSources: number): Promise<ProductSources> {
        return this.prisma.productSources.delete({
            where:{id_productSources:Number(id_productSources)}
        })
    }


    private calculateTotalHarga(jumlah: number, harga: number, ongkosProses: number): number {
        return harga + ongkosProses;
    }


	// total semua barang yang dibeli
    async TotalProductSources(): Promise<number> {
        const totalStock = await this.prisma.productSources.aggregate({
            _sum: { jumlah_productSources: true },
        });

        return totalStock._sum.jumlah_productSources || 0;
    }

    // Modifikasi layanan ProductSources
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




}

