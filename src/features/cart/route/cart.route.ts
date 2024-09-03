import express from 'express';
import { cartController } from '../controller/cart.controller';
import { verifyUser } from '~/globals/middlewares/auth.middleware';


const cartRoute = express.Router();

cartRoute.use(verifyUser)
cartRoute.post('/', cartController.addToCart);
cartRoute.delete('/:id', cartController.clearCart);
cartRoute.delete('/item/:id', cartController.removeCartItem);
cartRoute.get('', cartController.getMyCart);

export default cartRoute;