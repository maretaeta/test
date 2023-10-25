import { Body, Controller, Get, Post,} from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { penjualanService } from "./penjualan.service";
import { penjualan } from "./penjualan.model";


@Controller('api/v1/penjualan')
export class penjualanController{
    constructor(private readonly penjualanService: penjualanService){}

    @Get()
    async getAllPenjualan():Promise<penjualan[]>{
        return this.penjualanService.getAllPenjualan()
    }

    // @Get(':id_penjualan')
    // async getPenjualan(@Param('id_penjualan') id_penjualan: string): Promise<penjualan | null> {
    //     // Validasi apakah id_penjualan adalah angka
    //     if (!/^\d+$/.test(id_penjualan)) {
    //         throw new Error('ID penjualan harus berupa angka');
    //     }

    //     return this.penjualanService.getPenjualan(Number(id_penjualan));
    // }

    @Post("create")
    async createPenjualan(@Body() requestData: { postPenjualan: penjualan, selectedProducts: { id: number; quantity: number }[] }) {
        try {
            const { postPenjualan, selectedProducts } = requestData;
            const result = await this.penjualanService.createPenjualan(postPenjualan, selectedProducts.map(item => ({ productId: item.id, quantity: item.quantity })));
            return { data: result.penjualan, message: "Penjualan created successfully" };
        } catch (error) {
            console.error(error);
            return {
                error: "Internal Server Error",
                message: "An error occurred while creating the penjualan.",
            };
        }
    }


    // @Put('update/:id_penjualan')
    // async updatePenjualan(@Param('id_penjualan') id_penjualan:number, @Body() postPenjualan:penjualan):Promise<penjualan>{
    //     return this.penjualanService.updatePenjualan(id_penjualan, postPenjualan)
    // }

    // @Delete(':id_penjualan')
    // async deletePenjualan(@Param('id_penjualan') id_penjualan:number){
    //     await this.penjualanService.deletePenjualan(id_penjualan)
    //     return "Penjualan Deleeted"
    // }


    // @Get('total')
    // async sumTotalStock(): Promise<{ total: number }> {
    //     const total = await this.penjualanService.totalPenjualan();
    //     return { total };
    // }




    // @Get('changes')
    // async getPenjualanChanges(
    //     @Query('startDate') startDate: Date,
    //     @Query('endDate') endDate: Date
    // ): Promise<{ date: string; total: number }[]> {
    //     return this.penjualanService.getPenjualanChanges(startDate, endDate);
    // }
}