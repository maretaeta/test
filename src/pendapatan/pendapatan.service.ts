import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { pendapatan } from "./pendapatan.model";

@Injectable()
export class PendapatanService {
  constructor(private prisma: PrismaService) {}

  async inputBiayaOperasional(
    bensin: number,
    service: number,
    pembelian: number,
    biayalain: number,
    tanggal: Date,
    userId: number
  ): Promise<pendapatan> {
    // Validate userId
    if (userId === undefined || userId === null) {
      throw new NotFoundException("User not found");
    }

    // Validate other parameters if needed

    const totalBiayaOperasional = bensin + service + pembelian + biayalain;

    // Format tanggal to ISO-8601 date string
    const formattedTanggal = tanggal.toISOString().split('T')[0];

    // Create a new record for operational costs
    await this.prisma.pendapatan.create({
      data: {
        jumlah: totalBiayaOperasional,
        tanggal: formattedTanggal,
        userId: userId,
        keterangan: "Biaya Operasional",
      },
    });

    // Calculate net income for the month
    const pendapatanBulanan = await this.calculatePendapatanBulanan(userId, tanggal);

    // Create a new record for net income
    const pendapatanNet = await this.prisma.pendapatan.create({
      data: {
        jumlah: pendapatanBulanan,
        tanggal: formattedTanggal,
        userId: userId,
        keterangan: "Pendapatan Bersih",
      },
    });

    return pendapatanNet; // Return the created pendapatan object
  }

  async calculatePendapatanBulanan(userId: number, tanggal: Date): Promise<number> {
    const bulan = tanggal.getMonth() + 1;
    const tahun = tanggal.getFullYear();

    try {
      const lastDayOfMonth = new Date(tahun, bulan, 0);

      // Calculate total sales for the month
      const totalPenjualan = await this.prisma.penjualan.aggregate({
        _sum: {
          totalHarga_product: true,
        },
        where: {
          userId: userId,
          createdAt: {
            gte: new Date(`${tahun}-${bulan.toString().padStart(2, '0')}-01T00:00:00.000Z`),
            lt: new Date(`${tahun}-${bulan.toString().padStart(2, '0')}-${lastDayOfMonth.getDate()}T23:59:59.999Z`),
          },
        },
      });

      // Calculate total purchases for the month
      const totalPembelian = await this.prisma.productSources.aggregate({
        _sum: {
          totalPembelian_productSources: true,
        },
        where: {
          userId: userId,
          createdAt: {
            gte: new Date(`${tahun}-${bulan.toString().padStart(2, '0')}-01T00:00:00.000Z`),
            lt: new Date(`${tahun}-${bulan.toString().padStart(2, '0')}-${lastDayOfMonth.getDate()}T23:59:59.999Z`),
          },
        },
      });

      // Fetch operational costs for the month
      const totalBiayaOperasional = await this.prisma.pendapatan.aggregate({
        _sum: {
          jumlah: true,
        },
        where: {
          userId: userId,
          tanggal: {
            gte: new Date(`${tahun}-${bulan.toString().padStart(2, '0')}-01T00:00:00.000Z`),
            lt: new Date(`${tahun}-${bulan.toString().padStart(2, '0')}-${lastDayOfMonth.getDate()}T23:59:59.999Z`),
          },
          keterangan: "Biaya Operasional",
        },
      });

      // Calculate net income for the month
      const netIncome = (totalPenjualan?._sum?.totalHarga_product || 0) -
        (totalPembelian?._sum?.totalPembelian_productSources || 0) -
        (totalBiayaOperasional?._sum?.jumlah || 0);

      return netIncome;
    } catch (error) {
      console.error("Error calculating monthly income:", error);
      throw error; // You might want to handle or log the error accordingly
    }
  }
}
