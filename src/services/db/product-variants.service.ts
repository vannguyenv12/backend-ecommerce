import { Product, ProductVariant } from "@prisma/client";
import { IProductVariantBody } from "~/features/product-variant/interface/product-variant.interface";
import { Helper } from "~/globals/helpers/helper";
import { NotFoundException } from "~/globals/middlewares/error.middleware";
import { prisma } from "~/prisma";
import { productService } from "./product.service";

class ProductVariantService {
  public async add(productId: number, requestBody: IProductVariantBody, currentUser: UserPayload): Promise<ProductVariant> {
    const { name } = requestBody;

    const currentProduct: Product | null = await productService.getProduct(productId);

    if (!currentProduct) {
      throw new NotFoundException(`Product has ID: ${productId} does not exist`);
    }

    Helper.checkPermission(currentProduct!, 'shopId', currentUser);

    const variant: ProductVariant = await prisma.productVariant.create({
      data: {
        name,
        productId
      }
    });

    return variant
  }

  public async remove(productId: number, variantId: number, currentUser: UserPayload) {

    const currentProduct: Product | null = await productService.getProduct(productId);

    if (!currentProduct) {
      throw new NotFoundException(`Product has ID: ${productId} does not exist`);
    }
    Helper.checkPermission(currentProduct!, 'shopId', currentUser);

    await prisma.productVariant.delete({
      where: { id: variantId }
    });
  }
}

export const productVariantService: ProductVariantService = new ProductVariantService();