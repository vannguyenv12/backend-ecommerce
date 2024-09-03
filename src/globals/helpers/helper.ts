import { Coupon } from "@prisma/client";
import { ForbiddenException } from "../middlewares/error.middleware";

export class Helper {
  public static checkPermission<EntityType extends { [key: string]: any }>(entity: EntityType, entityProperty: string, currentUser: UserPayload) {
    if (currentUser.role === 'ADMIN') return;
    if (currentUser.id === entity![entityProperty]) return;

    throw new ForbiddenException('You cannot perform this action');

  }

  public static getOrderTotalPrice(coupon: Coupon, totalOrderPrice: number) {
    if (coupon.discountType === 'PERCENT') {
      return totalOrderPrice * (coupon.discountPrice / 100); // 100$ * 0.5
    } else if (coupon.discountType === 'VALUE') {
      return totalOrderPrice - coupon.discountPrice
    };

    return totalOrderPrice;
  }
}