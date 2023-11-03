import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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
    async sumTotalStock(): Promise<{ total: number }> {
        const total = await this.productService.sumTotalStock();
        return { total };
    }
}