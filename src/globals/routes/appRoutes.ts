import { Application } from "express";
import addressRoute from "~/features/address/route/address.route";
import cartRoute from "~/features/cart/route/cart.route";
import categoryRoute from "~/features/category/route/category.route";
import couponRoute from "~/features/coupon/route/coupon.route";
import dashboardRoute from "~/features/dashboard/route/dashboard.route";
import orderRoute from "~/features/order/route/order.route";
import productImagesRoute from "~/features/product-images/route/product-images.route";
import productVariantItemRoute from "~/features/product-variant/route/product-variant-item.route";
import productVariantRoute from "~/features/product-variant/route/product-variant.route";
import productRoute from "~/features/product/route/product.route";
import reviewRoute from "~/features/review/route/review.route";
import authRoute from "~/features/user/route/auth.route";
import userRoute from "~/features/user/route/user.route";
import wishlistRoute from "~/features/wishlist/route/wishlist.route";

const appRoutes = (app: Application) => {
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/categories', categoryRoute);
  app.use('/api/v1/products', productRoute);
  app.use('/api/v1/product-images', productImagesRoute);
  app.use('/api/v1/product-variants', productVariantRoute);
  app.use('/api/v1/product-variant-items', productVariantItemRoute);
  app.use('/api/v1/wishlists', wishlistRoute);
  app.use('/api/v1/addresses', addressRoute);
  app.use('/api/v1/carts', cartRoute);
  app.use('/api/v1/orders', orderRoute);
  app.use('/api/v1/coupons', couponRoute);
  app.use('/api/v1/reviews', reviewRoute);
  app.use('/api/v1/dashboard', dashboardRoute);

}

export default appRoutes;