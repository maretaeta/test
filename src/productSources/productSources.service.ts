import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";
import { productSources } from "./productSources.model";

@Injectable()
export class productSourcesService {
    constructor(private prisma: PrismaService) {}

	// get data pembelian
	async getAllProductSources(): Promise<productSources[]> {
		return this.prisma.productSources.findMany({
			include: {
				product: {
					select: {
						id_product: true,
						jenis_product: true,
						nama_product: true,
						ukuran_product: true,
						stok_product: true,
						harga_product: true,
						keuntungan: true,
						hargaJual: true,
						createdAt: true,
					},
				},
			},
		});
	}



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
    async createProductSources(data: productSources): Promise<productSources> {
        const existingProduct = await this.prisma.product.findUnique({
            where: { nama_product: data.nama_productSources },
        });

        if (existingProduct) {
            await this.prisma.product.update({
                where: { id_product: existingProduct.id_product },
                data: {
                    stok_product: existingProduct.stok_product + data.jumlah_productSources,
                },
            });
        } else {
            const totalHarga = this.calculateTotalHarga(data.jumlah_productSources, data.pembelian_productSources, data.ongkosProses_productSources);
            const harga = totalHarga / data.jumlah_productSources / 3;

            await this.prisma.product.create({
                data: {
                    jenis_product: data.jenis_productSources,
                    nama_product: data.nama_productSources,
                    ukuran_product: data.ukuran_productSources,
                    stok_product: data.jumlah_productSources,
                    harga_product: harga,
                },
            });
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

        return this.prisma.productSources.create({
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
                hargaPerLembar: harga,
            	product: {
					connect: { id_product: existingProduct.id_product },
				},

            },
        });
    }


	// update pembelian
    async updateProductSource(id_productSources: number, data: productSources): Promise<productSources> {
    const totalHarga = this.calculateTotalHarga(data.jumlah_productSources, data.pembelian_productSources, data.ongkosProses_productSources);
    const harga = totalHarga / data.jumlah_productSources / 3;

    return this.prisma.productSources.update({
        where: { id_productSources: Number(id_productSources) },
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
            hargaPerLembar: harga,
            product: {
                create: {
                    jenis_product: data.jenis_productSources,
                    nama_product: data.nama_productSources,
                    ukuran_product: data.ukuran_productSources,
                    stok_product: data.jumlah_productSources,
                    harga_product: harga,
                },
            },
        },
    });
}


	// hapus pembelian
    async deleteProductSources(id_productSources: number): Promise<productSources> {
        return this.prisma.productSources.delete({
            where: { id_productSources: Number(id_productSources) },
        });
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
}
