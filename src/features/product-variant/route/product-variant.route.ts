import express from 'express';
import { productVariantController } from '../controller/product-variant.controller';
import { checkPermission, verifyUser } from '~/globals/middlewares/auth.middleware';

const productVariantRoute = express.Router();

productVariantRoute.post('/:productId', verifyUser, checkPermission('ADMIN', 'SHOP'), productVariantController.addVariants)
productVariantRoute.delete('/:productId/:variantId', verifyUser, checkPermission('ADMIN', 'SHOP'), productVariantController.delete)


export default productVariantRoute;