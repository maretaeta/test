import { Prisma } from "@prisma/client";

export class toko implements Prisma.TokoCreateInput {
  id_toko?: number;
  namatoko?: string;
  notlp_toko: string;
  alamat_toko: string;
}
