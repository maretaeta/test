/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Put, Delete, Param, Query } from "@nestjs/common";
import { penjualanService } from "./penjualan.service";
import { penjualan } from "./penjualan.model";

@Controller('api/v1/penjualan')
export class penjualanController {
    constructor(private readonly penjualanService: penjualanService) {}

    @Get()
    async getAllPenjualan(): Promise<penjualan[]> {
        return this.penjualanService.getAllPenjualan();
    }

    @Get('detail/:id_penjualan') 
    async getPenjualan(@Param('id_penjualan') id_penjualan: number): Promise<penjualan | null> {
        return this.penjualanService.getPenjualan(id_penjualan);
    }

    @Post('create')
    async createPenjualan(
        @Body() requestData: {
            postPenjualan: penjualan;
            selectedProducts: { id: number; quantity: number }[];
        }
    ) {
        try {
            const { postPenjualan, selectedProducts } = requestData;
            const result = await this.penjualanService.createPenjualan(
                postPenjualan,
                selectedProducts.map(item => ({ productId: item.id, quantity: item.quantity }))
            );
            return { data: result.penjualan, message: "Penjualan created successfully" };
        } catch (error) {
            console.error(error);
            return {
                error: "Internal Server Error",
                message: "An error occurred while creating the penjualan.",
            };
        }
    }

    @Put('update/:id_penjualan')
    async updatePenjualan(
        @Param('id_penjualan') id_penjualan: number,
        @Body() postPenjualan: penjualan
    ): Promise<penjualan> {
        return this.penjualanService.updatePenjualan(id_penjualan, postPenjualan);
    }

    @Delete('delete/:id_penjualan')
    async deletePenjualan(@Param('id_penjualan') id_penjualan: number) {
        try {
            await this.penjualanService.deletePenjualan(id_penjualan);
            return "Penjualan Deleted";
        } catch (error) {
            console.error(error);
            return {
                error: "Internal Server Error",
                message: "An error occurred while deleting the penjualan.",
            };
        }
    }

    @Get('total')
    async getTotalPenjualan(): Promise<{ total: number }> {
        const total = await this.penjualanService.calculateTotalProductsTerjualForAll();
        return { total };
    }

    @Get('top')
    async getTopTokoByPenjualan() {
        const topToko = await this.penjualanService.getTopTokoByPenjualan();
        return topToko;
    }

     @Get('byJenisProduk/:jenisProduk')
        async getPenjualanByJenisProduk(@Param('jenisProduk') jenisProduk: string) {
            try {
            const penjualanByJenisProduk = await this.penjualanService.getPenjualanByJenisProduk(jenisProduk);
            return { success: true, data: penjualanByJenisProduk };
            } catch (error) {
            return { success: false, message: error.message };
            }
    }

     @Get('search')
        async searchPenjualan(@Query('keyword') keyword: string): Promise<penjualan[]> {
            try {
            const searchResult = await this.penjualanService.searchPenjualan(keyword);
            return searchResult;
            } catch (error) {
            console.error(error);
            throw new Error("An error occurred while searching for penjualan.");
            }
        }
}