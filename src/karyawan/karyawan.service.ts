import { PrismaService } from "src/prisma.service";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { karyawan } from "./karyawan.model";

@Injectable()
export class karyawanService {
    constructor(private prisma: PrismaService) {}

    async getAllKaryawan(): Promise<karyawan[]> {
        return this.prisma.karyawan.findMany();
    }

    async getKaryawanById(id_karyawan: number): Promise<karyawan> {
        const karyawan = await this.prisma.karyawan.findUnique({
            where: { id_karyawan: Number(id_karyawan) },
        });

        if (!karyawan) {
            throw new NotFoundException(`Karyawan with ID ${id_karyawan} not found`);
        }

        return karyawan;
    }

    async createKaryawan(data: karyawan): Promise<karyawan> {
        if (!data.nama_karyawan || !data.jabatan || !data.gaji) {
            throw new BadRequestException('Nama karyawan, jabatan, and gaji are required');
        }

        data.tanggal_masuk = data.tanggal_masuk ? new Date(data.tanggal_masuk) : new Date();

        return this.prisma.karyawan.create({
            data,
        });
    }

    async updateKaryawan(id_karyawan: number, data: karyawan): Promise<karyawan> {
        const existingKaryawan = await this.prisma.karyawan.findUnique({
            where: { id_karyawan:Number(id_karyawan) },
        });

        if (!existingKaryawan) {
            throw new NotFoundException(`Karyawan with ID ${id_karyawan} not found`);
        }


        if (!data.nama_karyawan || !data.jabatan || !data.gaji) {
            throw new BadRequestException('Nama karyawan, jabatan, and gaji are required');
        }

        data.tanggal_masuk = data.tanggal_masuk ? new Date(data.tanggal_masuk) : new Date();

        return this.prisma.karyawan.update({
            where: { id_karyawan:Number (id_karyawan) },
            data,
        });
    }

    async deleteKaryawan(id_karyawan: number): Promise<karyawan> {
        const existingKaryawan = await this.prisma.karyawan.findUnique({
            where: { id_karyawan:Number (id_karyawan) },
        });

        if (!existingKaryawan) {
            throw new NotFoundException(`Karyawan with ID ${id_karyawan} not found`);
        }

        return this.prisma.karyawan.delete({
            where: { id_karyawan: Number (id_karyawan) },
        });
    }
}
