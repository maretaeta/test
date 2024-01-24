import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { toko } from "./toko.model";

@Injectable()
export class tokoService {
  constructor(private prisma: PrismaService) {}

  // menampilkan semua toko
  async getAllToko(): Promise<toko[]> {
    return this.prisma.toko.findMany();
  }

  // menampilkan toko berdasarkan ID
  async getToko(id_toko: number): Promise<toko | null> {
    try {
      const result = await this.prisma.toko.findUnique({ where: { id_toko: Number(id_toko) } });
      if (!result) {
        throw new NotFoundException(`Toko with ID ${id_toko} not found`);
      }
      return result;
    } catch (error) {
      throw new NotFoundException(`Toko with ID ${id_toko} not found`);
    }
  }

  // membuat toko
  async createToko(data: toko): Promise<toko> {
    try {
      return this.prisma.toko.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException("Failed to create Toko");
    }
  }

  // update toko
  async updateToko(id_toko: number, data: toko): Promise<toko> {
    try {
      return this.prisma.toko.update({
        where: { id_toko: Number(id_toko) },
        data: {
          namatoko: data.namatoko,
          alamat_toko: data.alamat_toko,
          notlp_toko: data.notlp_toko,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Toko with ID ${id_toko} not found`);
    }
  }


  // delete toko
  async deleteToko(id_toko: number): Promise<void> {
    try {
        console.log(`Deleting Toko with ID: ${id_toko}`);

        // Fetch the nama_toko value for the store being deleted
        const storeToDelete = await this.prisma.toko.findUnique({
            where: { id_toko: Number(id_toko) },
            select: { namatoko: true },
        });

        if (!storeToDelete) {
            throw new NotFoundException(`Toko with ID ${id_toko} not found`);
        }

        // Fetch the new value for nama_toko in the penjualan table (e.g., 'Unknown')
        const newNamaTokoValue = 'Unknown';

        // Check if the newNamaTokoValue is a valid value in the toko table
        const existingToko = await this.prisma.toko.findFirst({
            where: { namatoko: newNamaTokoValue },
        });

        if (!existingToko) {
            console.error(`Invalid value for nama_toko: ${newNamaTokoValue}`);
            // Handle this error as per your business logic
            return;
        }

        // Update the nama_toko value in the penjualan table to a default or placeholder value
        const updatePenjualanResult = await this.prisma.penjualan.updateMany({
            where: { nama_toko: storeToDelete.namatoko },
            data: { nama_toko: newNamaTokoValue },
        });

        console.log(`Update Penjualan Result:`, updatePenjualanResult);

        const deleteResult = await this.prisma.toko.delete({
            where: { id_toko: Number(id_toko) },
        });

        console.log(`Delete Result:`, deleteResult);
    } catch (error) {
        console.error(`Error deleting Toko with ID ${id_toko}:`, error);
        throw new NotFoundException(`Toko with ID ${id_toko} not found`);
    }
}


// pencarian toko
async searchToko(keyword: string): Promise<toko[]> {
    try {
      return this.prisma.toko.findMany({
        where: {
          OR: [
            { namatoko: { contains: keyword, mode: "insensitive" } },
            { alamat_toko: { contains: keyword, mode: "insensitive" } },
           {notlp_toko: {contains: keyword, mode: "insensitive"}}
          ],
        },
      });
    } catch (error) {
      throw new NotFoundException(`No Toko found with keyword: ${keyword}`);
    }
  }

  // total toko yang ada
  async getTotalToko(): Promise<number> {
    try {
      const totalToko = await this.prisma.toko.count();
      return totalToko;
    } catch (error) {
      throw new BadRequestException("Failed to retrieve total number of Toko");
    }
  }
}

