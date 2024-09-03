import express from 'express';
import { addressController } from '../controller/address.controller';
import { verifyUser } from '~/globals/middlewares/auth.middleware';
import { validateSchema } from '~/globals/middlewares/validate.middleware';
import { addressSchema } from '../schema/address.schema';

const addressRoute = express.Router();


addressRoute.use(verifyUser)
addressRoute.post('/', validateSchema(addressSchema), addressController.addAddress);
addressRoute.delete('/:id', addressController.delete);
addressRoute.put('/:id', validateSchema(addressSchema), addressController.updateAddress);
addressRoute.get('/me', addressController.getMyAddress);

export default addressRoute;