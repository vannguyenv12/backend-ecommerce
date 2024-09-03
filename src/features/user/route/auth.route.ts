import express from 'express';
import { validateSchema, } from '~/globals/middlewares/validate.middleware';
import { userSchemaCreate } from '../schema/user.schema';
import { asyncWrapper } from '~/globals/middlewares/error.middleware';
import { authController } from '../controller/auth.controller';

const authRoute = express.Router();

authRoute.post('/register', validateSchema(userSchemaCreate), authController.registerUser);
authRoute.post('/login', authController.loginUser);
authRoute.post('/forget-password', authController.forgetPassword);
authRoute.post('/reset-password', authController.resetPassword);

export default authRoute;