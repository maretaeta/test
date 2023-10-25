import { Controller, Get, Param, Post, Put, Delete, Body } from "@nestjs/common";
import { productSources } from "./productSources.model";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { productSourcesService } from "./productSources.service";


@Controller('api/v1/pembelian')
export class productSourcesController{
    constructor(
        private readonly productSourcesService: productSourcesService){}


    @Get()
    async getAllProductSources(): Promise<productSources[]> {
        return this.productSourcesService.getAllProductSources();
    }

    // @Get(':id_productSources')
    // async getProductSources(@Param('id_productSources') id_productSources:number):Promise<productSources | null >{
    //     return this.productSourcesService.getProductSources(id_productSources)
    // }

    @Post('create')
    async postProductSources(@Body() postproductSources:productSources):Promise<productSources>{
        return this.productSourcesService.createProductSources(postproductSources)
    }

    @Put('update/:id_productSources')
    async updateproductSources(@Param('id_productSources') id_productSources:number, @Body() postproductSources: productSources):Promise<productSources>{
        return this.productSourcesService.updateProductSource(id_productSources, postproductSources)
    }

    @Delete(':id_productSources')
    async deleteproductSources(@Param('id_productSources') id_productSources:number){
        await this.productSourcesService.deleteProductSources(id_productSources)
        return "productSources Deleted"
    }

    @Get('total')
    async sumTotalStock(): Promise<{ total: number }> {
        const total = await this.productSourcesService.TotalProductSources();
        return { total };
    }

    
}
