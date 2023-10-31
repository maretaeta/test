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
              harga_product: true,
            },
          },
        },
      },
    },
  });
}

  // get detail penjualan
  async getPenjualan(id_penjualan: number): Promise<penjualan | null> {
    if (typeof id_penjualan !== 'number') {
      throw new Error('ID penjualan harus berupa angka');
    }

    return this.prisma.penjualan.findUnique({
      where: { id_penjualan },
      include: {
        products: true,
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

    const createdPenjualan = await this.prisma.penjualan.create({
      data: {
        diskon: data.diskon,
        totalHarga_product: totalHarga,
        // Create PenjualanItem records for associated products
        penjualanItems: {
          create: productsWithDetails.map((product) => ({
            quantity: product.quantity,
            productId: product.id_product,
          })),
        },
      },
      include: {
        penjualanItems: true,
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

  // delete
  async deletePenjualan(id_penjualan: number): Promise<void> {
  await this.prisma.penjualan.delete({
    where: { id_penjualan },
  });
}


  // total penjualan
async calculateTotalProductsTerjualForAll(): Promise<number> {
    const allPenjualan = await this.prisma.penjualan.findMany({
        include: {
            penjualanItems: {
                select: {
                    quantity: true,
                },
            },
        },
    });

    const totalProductsTerjual = allPenjualan.reduce(
        (total, penjualan) => {
            const penjualanTotal = penjualan.penjualanItems.reduce(
                (itemTotal, item) => itemTotal + (item.quantity || 0),
                0
            );
            return total + penjualanTotal;
        },
        0
    );

    return totalProductsTerjual;
}






}


  

interface CreatePenjualanResponse {
  penjualan: penjualan;
  products: (product & { quantity: number })[];
}

export interface PenjualanCreateInput {
  diskon?: number;
  totalHarga_product?: number;
}
