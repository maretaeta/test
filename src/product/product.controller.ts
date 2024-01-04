import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { productService } from "./product.service";
import { product } from "./product.model";


@Controller('api/v1/product')
export class productController{
    constructor(private readonly productService: productService ){}

    @Get()
    async getAllProduct():Promise<product[]>{
        return this.productService.getAllProduct()
    }

    @Post('create')
    async postProduct(@Body() postProduct:product):Promise<product>{
        return this.productService.createProduct(postProduct)
    }

    @Put('update/:id_product')
    async updateProduct(@Param('id_product') id_product:number, @Body() postProduct: product):Promise<product>{
        return this.productService.updateBarang(id_product, postProduct)
    }

    @Delete(':id_product')
    async deleteProduct(@Param('id_product') id_product:number){
        await this.productService.deleteProduct(id_product)
        return "Product Deleted"
    }

    @Get('total')
    async sumTotalStock(@Query('month') monthName?: string): Promise<{ month: string; total: number }> {
        try {
            const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
            const selectedMonth = monthName || currentMonth;

            const result = await this.productService.sumTotalStockByMonth(selectedMonth);

            return result;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to calculate total stock');
        }
    }

    @Get('filter/:type')
    async getProductsByType(@Param('type') type: string): Promise<product[]> {
        return this.productService.getProductsByType(type);
    }

}