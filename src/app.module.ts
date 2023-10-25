import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PenjualanModule } from './penjualan/penjualan.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { productSourcesModule } from './productSources/productSources.module';
import { tokoModule } from './toko/toko.module';

@Module({
  imports: [ProductModule, PenjualanModule, AuthModule, UserModule, productSourcesModule, tokoModule],
  controllers: [],
  providers: [],
})

export class AppModule {}