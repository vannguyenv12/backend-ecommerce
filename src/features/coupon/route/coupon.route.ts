import express from 'express';
import { checkPermission, verifyUser } from '~/globals/middlewares/auth.middleware';
import { couponController } from '../controller/coupon.controller';
import { validateSchema } from '~/globals/middlewares/validate.middleware';
import { couponSchema, couponUpdateSchema } from '../schema/coupon.schema';


const couponRoute = express.Router();

couponRoute.use(verifyUser)
couponRoute.use(checkPermission('ADMIN'))
couponRoute.post('/', validateSchema(couponSchema), couponController.create);
couponRoute.put('/:code', validateSchema(couponUpdateSchema), couponController.update);
couponRoute.get('/', couponController.read);
couponRoute.get('/:code', couponController.readOne);
couponRoute.delete('/:code', couponController.delete);

export default couponRoute;