import { Product, ProductVariant, ProductVariantItem } from "@prisma/client";

export interface IProductVariantBody {
  name: string;
}

export interface IProductVariant extends ProductVariant {
  productVariantItems: ProductVariantItem[]
}
