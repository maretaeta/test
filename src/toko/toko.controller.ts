import { Controller, Get, Param, Post, Query, Body, Put, Delete, HttpCode, NotFoundException } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { tokoService } from "./toko.service";
import { toko } from "./toko.model";

@Controller('api/v1/toko')
export class tokoController {

  constructor(private readonly tokoService: tokoService) {}

  @Get()
  async getAllToko(): Promise<toko[]> {
    return this.tokoService.getAllToko();
  }

  @Get('detail/:id_toko')
  async getToko(@Param('id_toko') id_toko: number): Promise<toko | null> {
    return this.tokoService.getToko(id_toko);
  }

  @Post('create')
  async createToko(@Body() postToko: toko): Promise<toko> {
    return this.tokoService.createToko(postToko);
  }

  @Put('update/:id_toko')
  async updateToko(@Param('id_toko') id_toko: number, @Body() postToko: toko): Promise<toko> {
    return this.tokoService.updateToko(id_toko, postToko);
  }

  @Delete('delete/:id_toko')
  @HttpCode(204)
  async deleteToko(@Param('id_toko') id_toko: number): Promise<void> {
    await this.tokoService.deleteToko(id_toko);
  }

   @Get('search')
  async searchToko(@Query('keyword') keyword: string): Promise<toko[]> {
    return this.tokoService.searchToko(keyword);
  }

   @Get('total')
  async getTotalToko(): Promise<{ totalToko: number }> {
    try {
      const totalToko = await this.tokoService.getTotalToko();
      return { totalToko };
    } catch (error) {
      throw new NotFoundException('Failed to retrieve total number of Toko');
    }
  }
}
