import { Controller, Get, Post, Put, Delete,Query,  Body, Param } from "@nestjs/common";
import { ProductSourcesService } from "./productSources.service";
import { ProductSources } from "./productSources.model";
import { Prisma } from "@prisma/client"; 

@Controller('api/v1/pembelian')
export class productSourcesController {
  constructor(private readonly productSourcesService: ProductSourcesService) {}

    @Get()
    async getAllProductSources(): Promise<ProductSources[]> {
        return this.productSourcesService.getAllProductSources();
    }


    @Post('create')
    async postProductSources(@Body() postProductSources: Prisma.ProductSourcesCreateInput): Promise<ProductSources> {
        return this.productSourcesService.createProductSources(postProductSources);
    }


    @Put('update/:id_productSources')
    async updateProductSources(@Param('id_productSources') id_productSources: number, @Body() postProductSources: Prisma.ProductSourcesCreateInput): Promise<ProductSources> {
        return this.productSourcesService.updateProductSource(id_productSources, postProductSources);
    }

  @Delete(':id_productSources')
  async deleteproductSources(@Param('id_productSources') id_productSources: number) {
    await this.productSourcesService.deleteProductSources(id_productSources);
    return "productSources Deleted";
  }

  @Get('total')
  async sumTotalStock(): Promise<{ total: number }> {
    const total = await this.productSourcesService.TotalProductSources();
    return { total };
  }

  
  @Get('filter')
  async getPenjualanByBulanTahun(
    @Query('bulan') bulan: number,
    @Query('tahun') tahun: number,
  ) {
    const data = await this.productSourcesService.getPembelianByBulanTahun(bulan, tahun);
    return data;
  }

  @Get('sales/:year')
    async getSalesByYear(@Param('year') year: number) {
      return this.productSourcesService.getSalesByYear(year);
}


}
