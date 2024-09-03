import { Product, ProductImages } from "@prisma/client";
import { Express } from "express";
import { prisma } from "~/prisma";
import { productService } from "./product.service";
import { NotFoundException } from "~/globals/middlewares/error.middleware";
import { Helper } from "~/globals/helpers/helper";

class ProductImagesService {
  public async add(productId: number, currentUser: UserPayload, files: Express.Multer.File[]): Promise<void> {

    // ADMIN, SHOP (owner)
    const currentProduct: Product | null = await productService.getProduct(productId);

    if (!currentProduct) {
      throw new NotFoundException(`Product has ID: ${productId} does not exist`);
    }

    Helper.checkPermission(currentProduct!, 'shopId', currentUser);

    const productImages: ProductImages[] = [];

    for (const file of files) {
      productImages.push({
        image: file.filename,
        productId
      } as ProductImages);
    }

    await prisma.productImages.createMany({
      data: productImages
    })
  }

  public async remove(productId: number, imageId: number, currentUser: UserPayload): Promise<void> {

    // ADMIN, SHOP (owner)
    const currentProduct: Product | null = await productService.getProduct(productId);

    if (!currentProduct) {
      throw new NotFoundException(`Product has ID: ${productId} does not exist`);
    }

    Helper.checkPermission(currentProduct!, 'shopId', currentUser);

    await prisma.productImages.delete({
      where: { id: imageId }
    })
  }
}

export const productImagesService: ProductImagesService = new ProductImagesService();