import express from 'express'
import { validateSchema } from '~/globals/middlewares/validate.middleware'
import { productController } from '../controller/product.controller'
import { productSchema } from '../schema/product.schema'
import { checkPermission, preventInActiveUser, verifyUser } from '~/globals/middlewares/auth.middleware'
import { upload } from '~/globals/helpers/upload'

const productRoute = express.Router()

// ANYONE
productRoute.get('/', productController.read)
productRoute.get('/me', verifyUser, productController.readMyProducts)
productRoute.get('/:id', productController.readOne)

// VERIFY

productRoute.use(verifyUser)
productRoute.use(checkPermission('SHOP', 'ADMIN'))
productRoute.use(preventInActiveUser)

productRoute.post('/', upload.single('main_image'), validateSchema(productSchema), productController.create)
productRoute.put('/:id', upload.single('main_image'), validateSchema(productSchema), productController.update)
productRoute.delete('/:id', productController.delete)

export default productRoute
