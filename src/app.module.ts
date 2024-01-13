import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PenjualanModule } from './penjualan/penjualan.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { productSourcesModule } from './productSources/productSources.module';
import { tokoModule } from './toko/toko.module';
import { KaryawanModule } from './karyawan/karyawan.module';
import { pendapatanModule } from './pendapatanPerHari/pendapatan.module';
import { PengeluaranModule } from './pengeluaran/pengeluaran.modul';


@Module({
  imports: [ProductModule, PenjualanModule, AuthModule, UserModule, productSourcesModule, tokoModule, KaryawanModule, pendapatanModule, PengeluaranModule],
  controllers: [],
  providers: [],
})

export class AppModule {}