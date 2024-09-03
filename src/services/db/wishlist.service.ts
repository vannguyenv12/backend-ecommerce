import { Wishlist } from "@prisma/client";
import { IWishlistBody } from "~/features/wishlist/interface/wishlist.interface";
import { BadRequestException, NotFoundException } from "~/globals/middlewares/error.middleware";
import { prisma } from "~/prisma";

class WishlistService {
  public async add(requestBody: IWishlistBody, currentUser: UserPayload): Promise<void> {
    const { productId } = requestBody;

    // check 
    const wishlist = await this.getWishlist(productId, currentUser.id);

    if (wishlist) {
      throw new BadRequestException(`This product with ID ${productId} already exist!`);
    }


    await prisma.wishlist.create({
      data: {
        productId,
        userId: currentUser.id
      }
    })
  }

  public async remove(productId: number, currentUser: UserPayload) {
    if (await this.getCountWishlist(productId, currentUser.id) <= 0) {
      throw new NotFoundException(`Product in wishlist not found`);
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          productId,
          userId: currentUser.id
        }
      }
    });

  }

  private async getWishlist(productId: number, userId: number): Promise<Wishlist | null> {
    const wishlist: Wishlist | null = await prisma.wishlist.findFirst({
      where: {
        productId,
        userId
      }
    });

    return wishlist
  }

  private async getCountWishlist(productId: number, userId: number): Promise<number> {
    const count: number = await prisma.wishlist.count({
      where: {
        productId,
        userId,
      }
    });

    return count;
  }

  public async get(currentUser: UserPayload): Promise<Wishlist[]> {
    const wishlist: Wishlist[] = await prisma.wishlist.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        product: true,
      }
    });

    return wishlist;
  }
}

export const wishlistService: WishlistService = new WishlistService();