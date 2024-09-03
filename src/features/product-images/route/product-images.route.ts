import express from 'express';
import { productImagesController } from '../controller/product-images.controller';
import { upload } from '~/globals/helpers/upload';
import { checkPermission, verifyUser } from '~/globals/middlewares/auth.middleware';

const productImagesRoute = express.Router();

productImagesRoute.use(verifyUser);
productImagesRoute.use(checkPermission('ADMIN', 'SHOP'));

productImagesRoute.post('/:productId', upload.array('images', 10), productImagesController.addImages);
productImagesRoute.delete('/:productId/:imageId', productImagesController.delete);


export default productImagesRoute;