import express from 'express';
import { categoryController } from '../controller/category.controller';
import { validateSchema } from '~/globals/middlewares/validate.middleware';
import { createCategorySchema } from '../schema/category.schema';
import { checkPermission, preventInActiveUser, verifyUser } from '~/globals/middlewares/auth.middleware';

const categoryRoute = express.Router();

// EVERY USER CAN DO THIS ACTION
categoryRoute.get('/', categoryController.getAll);
categoryRoute.get('/:id', categoryController.get);

// Only verify user and user active and admin
categoryRoute.use(verifyUser)
categoryRoute.use(checkPermission('ADMIN'))
categoryRoute.use(preventInActiveUser)

categoryRoute.post('/', validateSchema(createCategorySchema), categoryController.create);
categoryRoute.put('/:id', categoryController.update);
categoryRoute.delete('/:id', categoryController.delete);

export default categoryRoute;