import { Request, Response } from "express";
import { HTTP_STATUS } from "~/globals/constants/http";
import { wishlistService } from "~/services/db/wishlist.service";

class WishlistController {
  public async addWishlist(req: Request, res: Response) {
    await wishlistService.add(req.body, req.currentUser);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Add product to wishlist successfully'
    })
  }

  public async delete(req: Request, res: Response) {
    await wishlistService.remove(parseInt(req.params.productId), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Product was removed form wishlist'
    })
  }

  public async read(req: Request, res: Response) {
    const wishlists = await wishlistService.get(req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get my wishlist',
      data: wishlists
    })
  }
}

export const wishlistController: WishlistController = new WishlistController();