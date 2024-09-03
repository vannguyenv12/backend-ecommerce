import express from 'express';
import { wishlistController } from '../controller/wishlist.controller';
import { verifyUser } from '~/globals/middlewares/auth.middleware';

const wishlistRoute = express.Router();

wishlistRoute.use(verifyUser);

wishlistRoute.post('/', wishlistController.addWishlist);
wishlistRoute.delete('/:productId', wishlistController.delete);
wishlistRoute.get('/', wishlistController.read);


export default wishlistRoute;