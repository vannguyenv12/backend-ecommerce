import { Product, ProductVariant, ProductVariantItem } from "@prisma/client";
import { NotFoundException } from "~/globals/middlewares/error.middleware";
import { prisma } from "~/prisma"
import { productService } from "./product.service";
import { Helper } from "~/globals/helpers/helper";
import { IProductVariant, IProductVariantBody } from "~/features/product-variant/interface/product-variant.interface";

class ProductVariantItemsService {
  public async add(productId: number, variantId: number, requestBody: IProductVariantBody, currentUser: UserPayload): Promise<ProductVariantItem> {
    const { name } = requestBody;

    // ADMIN, SHOP (owner)
    const currentProduct: Product | null = await productService.getProduct(productId);

    if (!currentProduct) {
      throw new NotFoundException(`Product has ID: ${productId} does not exist`);
    }

    Helper.checkPermission(currentProduct!, 'shopId', currentUser);

    const variantItem: ProductVariantItem = await prisma.productVariantItem.create({
      data: {
        name,
        variantId
      }
    });

    return variantItem;
  }

  public async remove(productId: number, variantId: number, variantItemId: number, currentUser: UserPayload) {

    // ADMIN, SHOP (owner)
    const currentProduct: Product | null = await productService.getProduct(productId);

    if (!currentProduct) {
      throw new NotFoundException(`Product has ID: ${productId} does not exist`);
    }

    Helper.checkPermission(currentProduct!, 'shopId', currentUser);


    const variant: IProductVariant | null = await prisma.productVariant.findFirst({
      where: {
        id: variantId
      },
      include: {
        productVariantItems: true,
      }
    });

    if (!variant) {
      throw new NotFoundException(`Product variant ID: ${variantId} not found`)
    }

    const index: number = variant.productVariantItems.findIndex((item: ProductVariantItem) => item.id === variantItemId);

    if (index <= -1) {
      throw new NotFoundException(`Product variant item ID: ${variantItemId} not found`);
    }

    await prisma.productVariantItem.delete({
      where: { id: variantItemId }
    })
  }
}

export const productVariantItemsService: ProductVariantItemsService = new ProductVariantItemsService()