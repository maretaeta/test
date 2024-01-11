import { Controller, Get, Post, Put, Delete, Query, Body, Param, HttpException, HttpStatus} from "@nestjs/common";
import { ProductSourcesService } from "./productSources.service";
import { ProductSources } from "./productSources.model";
import { Prisma } from "@prisma/client"; 

@Controller('api/v1/pembelian')
export class productSourcesController {
  constructor(private readonly productSourcesService: ProductSourcesService) {}

    // Semua pembelian Barang
    @Get()
    async getAllProductSources(): Promise<ProductSources[]> {
        return this.productSourcesService.getAllProductSources();
    }

    // Creaye pembelian barang
    @Post('create')
    async postProductSources(@Body() postProductSources: Prisma.ProductSourcesCreateInput): Promise<ProductSources> {
        return this.productSourcesService.createProductSources(postProductSources);
    }


  // Update pembelian barang
  @Put('update/:id_productSources')
    async updateProductSources(@Param('id_productSources') id_productSources: number, @Body() postProductSources: Prisma.ProductSourcesCreateInput): Promise<ProductSources> {
        return this.productSourcesService.updateProductSource(id_productSources, postProductSources);
    }

  // Delete pembelian barang
  @Delete(':id_productSources')
  async deleteproductSources(@Param('id_productSources') id_productSources: number) {
    await this.productSourcesService.deleteProductSources(id_productSources);
    return "productSources Deleted";
  }

  // Get pembelian (akumulasi)
  @Get('total')
  async sumTotalStock(@Query('month') monthName?: string): Promise<{ month: string; total: number }> {
    try{
      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
      const selectedMonth = monthName || currentMonth;

      const result = await this.productSourcesService.TotalProductSources(selectedMonth);

      return result;
    }catch(error){
      console.error(error);
      throw new Error('Failed to calculate jumlah product sources')
    }
  }

  // 
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

  // Filter by wood type
  @Get('filter-jenis-kayu')
  async filterByWoodType(@Query('jenisKayu') jenisKayu: string): Promise<ProductSources[]> {
    return this.productSourcesService.filterProductSourcesByWoodType(jenisKayu);
  }

  @Get('date-range')
    async getProductsInDateRange(
        @Query('start') start: string,
        @Query('end') end: string,
    ): Promise<ProductSources[]> {
        try {
            const startDate = new Date(start);
            const endDate = new Date(end);

            const filterData = await this.productSourcesService.getProductsInDateRange({
                start: startDate,
                end: endDate,
            });

            return filterData;
        } catch (error) {
            console.error('Error fetching products in date range:', error);
            throw new HttpException('Error fetching products in date range', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('search')
    async searchProductSources(@Query('query') query: string): Promise<ProductSources[]> {
      return this.productSourcesService.searchProductSources(query);
    }


     @Get('monthly-profit')
  async getMonthlyProfit(): Promise<{ month: string; profit: number }[]> {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      // Calculate monthly profit for the current year and month
      const monthlyProfits = await this.productSourcesService.calculateMonthlyProfit(currentYear);
      return monthlyProfits;
    } catch (error) {
      // Handle error appropriately, e.g., return a proper HTTP response
      console.error(error);
      throw new Error('Failed to retrieve monthly profits.');
    }
  }
}