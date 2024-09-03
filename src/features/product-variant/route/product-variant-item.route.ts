import express from 'express';
import { checkPermission, verifyUser } from '~/globals/middlewares/auth.middleware';
import { productVariantItemController } from '../controller/product-variant-item.controller';

const productVariantItemRoute = express.Router();

productVariantItemRoute.use(verifyUser);
productVariantItemRoute.use(checkPermission('ADMIN', 'SHOP'));

productVariantItemRoute.post('/:productId/:variantId', productVariantItemController.addItems);
productVariantItemRoute.delete('/:productId/:variantId/:variantItemId', productVariantItemController.delete);


export default productVariantItemRoute;