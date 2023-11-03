import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { toko } from "./toko.model";

@Injectable()
export class tokoService {
  constructor(private prisma: PrismaService) {}

  async getAllToko(): Promise<toko[]> {
    return this.prisma.toko.findMany();
  }

  async getToko(id_toko: number): Promise<toko | null> {
    return this.prisma.toko.findUnique({ where: { id_toko: Number(id_toko) } });
  }

  async createToko(data: toko): Promise<toko> {
    return this.prisma.toko.create({
      data,
    });
  }

  async updateToko(id_toko: number, data: toko): Promise<toko> {
      return this.prisma.toko.update({
        where: {id_toko:Number(id_toko)},
        data:{
            namatoko: data.namatoko,
            alamat_toko:data.alamat_toko,
            notlp_toko:data.notlp_toko,
        }
        
      });
    }

  async deleteToko(id_toko: number): Promise<toko> {
      return this.prisma.toko.delete({
        where: { id_toko:Number (id_toko) },
      });
  }
}
