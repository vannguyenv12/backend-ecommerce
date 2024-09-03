import express from 'express';
import { verifyUser } from '~/globals/middlewares/auth.middleware';
import { reviewController } from '../controller/review.controller';
import { validateSchema } from '~/globals/middlewares/validate.middleware';
import { reviewSchemaCreate, reviewSchemaUpdate } from '../schema/review.schema';

const reviewRoute = express.Router();

reviewRoute.get('/avg/:id', reviewController.getAvg);
reviewRoute.use(verifyUser);

reviewRoute.post('/', validateSchema(reviewSchemaCreate), reviewController.addReview);
reviewRoute.put('/:id', validateSchema(reviewSchemaUpdate), reviewController.updateReview);
reviewRoute.delete('/:id', reviewController.deleteReview);


export default reviewRoute;