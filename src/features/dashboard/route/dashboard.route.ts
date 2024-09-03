import express from 'express';
import { dashboardController } from '../controller/dashboard.controller';

const dashboardRoute = express.Router();

dashboardRoute.get('/', dashboardController.read);


export default dashboardRoute;