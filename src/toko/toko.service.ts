import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { toko } from "./toko.model";

@Injectable()
export class tokoService {
  constructor(private prisma: PrismaService) {}

  async getAllToko(): Promise<toko[]> {
    return this.prisma.toko.findMany();
  }

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

  async createToko(data: toko): Promise<toko> {
    try {
      return this.prisma.toko.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException("Failed to create Toko");
    }
  }

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

  async deleteToko(id_toko: number): Promise<toko> {
    try {
      return this.prisma.toko.delete({
        where: { id_toko: Number(id_toko) },
      });
    } catch (error) {
      throw new NotFoundException(`Toko with ID ${id_toko} not found`);
    }
  }

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

  async getTotalToko(): Promise<number> {
    try {
      const totalToko = await this.prisma.toko.count();
      return totalToko;
    } catch (error) {
      throw new BadRequestException("Failed to retrieve total number of Toko");
    }
  }
}

