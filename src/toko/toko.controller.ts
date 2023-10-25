import { Controller, Get, Param, Post, Body, Put, Delete } from "@nestjs/common/decorators";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { tokoService } from "./toko.service";
import { toko } from "./toko.model";


@Controller('api/v1/toko')
export class tokoController{

    constructor(private readonly tokoService:tokoService){}

        @Get()
        async getAllToko():Promise<toko []>{
            return this.tokoService.getAllToko()
        }

        @Get(':id_toko')
        async getToko(@Param('id_toko') id_toko:number):Promise<toko | null>{
            return this.tokoService.getToko(id_toko)
        }

        @Post('create')
        async createToko(@Body() postToko:toko):Promise<toko>{
            return this.tokoService.createToko(postToko)
        }

        @Put('update/:id_toko')
        async updateToko(@Param('id_toko') id_toko:number, @Body() postToko: toko):Promise<toko>{
            return this.tokoService.updateToko(id_toko, postToko)
        }

        @Delete(':id_toko')
        async deleteToko(@Param('id_toko') id_toko:number){
            await this.tokoService.deleteToko(id_toko)
            return "Toko Deleted"
        }
    
}