import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { penjualan } from './penjualan.model';
import { product } from 'src/product/product.model';

type SelectedProduct = {
  productId: number;
  quantity: number;
};

@Injectable()
export class penjualanService {
  constructor(private prisma: PrismaService) {}

  // get penjualan
  async getAllPenjualan(): Promise<penjualan[]> {
    return this.prisma.penjualan.findMany({
      include: {
        penjualanItems: {
          include: {
            product: {
              select: {
                jenis_product: true,
                nama_product: true,
                ukuran_product: true,
                hargaJual: true
              },
            },
          },
        },
      },
    });
  }

// get detail penjualan
async getPenjualan(id_penjualan: number): Promise<penjualan | null> {
  return this.prisma.penjualan.findUnique({
    where: { id_penjualan: Number(id_penjualan) },
    include: {
      penjualanItems: {
        include: {
          product: {
            select: {
              jenis_product: true, 
              nama_product: true,
              ukuran_product: true,
              harga_product: true 
            },
          },
        },
      },
    },
  });
}

  // create penjualan
  async createPenjualan(
    data: PenjualanCreateInput,
    selectedProducts: SelectedProduct[]
  ): Promise<CreatePenjualanResponse> {
    try {
      if (!data || typeof data.diskon === 'undefined') {
        throw new Error('Data atau diskon tidak valid');
      }

      if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
        throw new Error('selectedProducts harus berisi setidaknya satu produk');
      }

      let tokoData = await this.prisma.toko.findUnique({
        where: { namatoko: data.nama_toko },
      });

      if (!tokoData) {
        tokoData = await this.prisma.toko.create({
          data: {
            namatoko: data.nama_toko,
          },
        });
      }

      const productsWithDetails: (product & { quantity: number })[] = [];
      let totalHarga = 0;

      for (const selectedProduct of selectedProducts) {
        const productData = await this.prisma.product.findUnique({
          where: { id_product: selectedProduct.productId },
        });

        if (!productData) {
          throw new Error(`Produk dengan ID ${selectedProduct.productId} tidak ditemukan`);
        }

        if (productData.stok_product < selectedProduct.quantity) {
          throw new Error(`Stok produk untuk ${productData.nama_product} tidak mencukupi`);
        }

        const hargaJual = productData.hargaJual || 0;
        const hargaProduk = hargaJual * selectedProduct.quantity;
        totalHarga += hargaProduk;

        // Include the "quantity" field for each product
        productsWithDetails.push({
          ...productData,
          quantity: selectedProduct.quantity,
        });

        // Decrease product stock upon sale
        await this.prisma.product.update({
          where: { id_product: selectedProduct.productId },
          data: {
            stok_product: {
              decrement: selectedProduct.quantity,
            },
          },
        });
      }

      // Menghitung total harga setelah mengurangkan diskon
      const totalHargaSetelahDiskon = totalHarga - data.diskon;

      const createdPenjualan = await this.prisma.penjualan.create({
      data: {
        nama_toko: tokoData.namatoko,
        diskon: data.diskon,
        totalHarga_product: totalHargaSetelahDiskon, 
        penjualanItems: {
          create: productsWithDetails.map((product) => ({
            quantity: product.quantity,
            productId: product.id_product,
          })),
        },
      },
      include: {
        penjualanItems: true,
        toko: true,
      },
    });


      return { penjualan: createdPenjualan, products: productsWithDetails };
    } catch (error) {
      throw new Error(`Gagal membuat penjualan: ${error.message}`);
    }
  }

  // update
  async updatePenjualan(id_penjualan: number, updatedData: PenjualanCreateInput): Promise<penjualan> {
    return this.prisma.penjualan.update({
      where: { id_penjualan },
      data: updatedData,
      include: {
        products: true,
      },
    });
  }

// delete penjualan
async deletePenjualan(id_penjualan: number): Promise<void> {
  try {
    const deletedPenjualan = await this.prisma.penjualan.findUnique({
      where: {
        id_penjualan: Number(id_penjualan),
      },
      include: {
        penjualanItems: {
          select: {
            quantity: true,
            productId: true,
          },
        },
      },
    });

    if (!deletedPenjualan) {
      throw new Error('Penjualan not found');
    }

    // Hapus terlebih dahulu data terkait di tabel anak (penjualanItems)
    await this.prisma.penjualanItem.deleteMany({
      where: {
        penjualanId: Number(id_penjualan),
      },
    });

    // Hapus penjualan
    await this.prisma.penjualan.delete({
      where: {
        id_penjualan: Number(id_penjualan),
      },
    });

    // Kembalikan jumlah produk ke stok
    for (const penjualanItem of deletedPenjualan.penjualanItems) {
      await this.prisma.product.update({
        where: {
          id_product: penjualanItem.productId,
        },
        data: {
          stok_product: {
            increment: penjualanItem.quantity,
          },
        },
      });
    }
  } catch (error) {
    console.error('Gagal menghapus penjualan:', error);
    throw new Error('Terjadi kesalahan saat menghapus penjualan');
  }
}



  // total penjualan
  async calculateTotalProductsTerjualForAll(): Promise<number> {
  try {
    const allPenjualanItems = await this.prisma.penjualanItem.findMany({
      select: {
        quantity: true,
      },
    });

    const totalProductsTerjual = allPenjualanItems.reduce(
      (total, penjualanItem) => total + (penjualanItem.quantity || 0),
      0
    );

    return totalProductsTerjual;
  } catch (error) {
    console.error('Error calculating total products terjual:', error);
    throw new Error('Error calculating total products terjual');
  }
}


  // Filter dan urutkan toko berdasarkan penjualan terbanyak
  async getTopTokoByPenjualan(): Promise<{ nama_toko: string; totalPenjualan: number; totalHarga: number }[]> {
    const topToko = await this.prisma.toko.findMany({
      include: {
        penjualan: {
          select: {
            penjualanItems: {
              select: {
                quantity: true,
                product: {
                  select: {
                    hargaJual: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    

    // Menghitung total penjualan dan total harga untuk setiap toko
    const tokoData: { nama_toko: string; totalPenjualan: number; totalHarga: number }[] = [];
    topToko.forEach((toko) => {
      const totalPenjualan = toko.penjualan.reduce((total, penjualan) => {
        const penjualanTotal = penjualan.penjualanItems.reduce((itemTotal, item) => {
          return itemTotal + (item.quantity || 0);
        }, 0);
        return total + penjualanTotal;
      }, 0);

      const totalHarga = toko.penjualan.reduce((total, penjualan) => {
        const penjualanTotalHarga = penjualan.penjualanItems.reduce((itemTotalHarga, item) => {
          const hargaProduk = item.quantity * (item.product.hargaJual || 0);
          return itemTotalHarga + hargaProduk;
        }, 0);
        return total + penjualanTotalHarga;
      }, 0);

      tokoData.push({ nama_toko: toko.namatoko, totalPenjualan, totalHarga });
    });

    tokoData.sort((a, b) => b.totalPenjualan - a.totalPenjualan);

    return tokoData;
  }  

  // filter
   async getPenjualanByJenisProduk(jenisProduk: string): Promise<penjualan[]> {
    try {
      const penjualanByJenisProduk = await this.prisma.penjualan.findMany({
        include: {
          penjualanItems: {
            where: {
              product: {
                jenis_product: jenisProduk,
              },
            },
            include: {
              product: {
                select: {
                  jenis_product: true,
                  nama_product: true,
                  ukuran_product: true,
                  hargaJual: true,
                },
              },
            },
          },
        },
      });

      return penjualanByJenisProduk;
    } catch (error) {
      console.error('Error getting penjualan by jenis  :', error);
      throw new Error('Error getting penjualan by jenis produk');
    }
  }

  async searchPenjualan(query: string): Promise<penjualan[]> {
  try {
    const penjualanSearchResult = await this.prisma.penjualan.findMany({
      where: {
        OR: [
          {
            nama_toko: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            penjualanItems: {
              some: {
                product: {
                  OR: [
                    {
                      jenis_product: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                    // {
                    //   penjualanItems: {
                    //     some: {
                    //       quantity: {
                    //         equals: parseInt(query) || undefined,
                    //       },
                    //     },
                    //   },
                    // },
                  ],
                },
              },
            },
          },
        ],
      },
      include: {
        penjualanItems: {
          include: {
            product: true,
          },
        },
      },
    });

   return penjualanSearchResult;
  } catch (error) {
    console.error("Error in searchPenjualan:", error);
    throw error;
  }
}

  
  }


interface CreatePenjualanResponse {
  penjualan: penjualan;
  products: (product & { quantity: number })[];
}

export interface PenjualanCreateInput {
  nama_toko?: string;
  diskon?: number;
  totalHarga_product?: number;
}
