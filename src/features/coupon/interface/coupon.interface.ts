import { DiscountType } from "@prisma/client";

export interface ICouponBody {
  code: string
  discountPrice: number;
  discountType: DiscountType;
}