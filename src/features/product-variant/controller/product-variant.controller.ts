import { Request, Response } from "express";
import { HTTP_STATUS } from "~/globals/constants/http";
import { productVariantService } from "~/services/db/product-variants.service";

class ProductVariantController {
  public async addVariants(req: Request, res: Response) {
    const variant = await productVariantService.add(parseInt(req.params.productId), req.body, req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Add product variant',
      data: variant
    })
  }

  public async delete(req: Request, res: Response) {
    await productVariantService.remove(parseInt(req.params.productId), parseInt(req.params.variantId), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete product variant'
    })
  }
}

export const productVariantController: ProductVariantController = new ProductVariantController();

