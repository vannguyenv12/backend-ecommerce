import { Request, Response } from 'express'
import { HTTP_STATUS } from '~/globals/constants/http'
import { orderService } from '~/services/db/order.service'

class OrderController {
  public async addOrder(req: Request, res: Response) {
    await orderService.addWithNoCoupon(req.body, req.currentUser)

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create order'
    })
  }

  public async updateOrderStatus(req: Request, res: Response) {
    await orderService.update(parseInt(req.params.id), req.body)

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update order status'
    })
  }

  public async getAllOrders(req: Request, res: Response) {
    const orders = await orderService.getAllOrders()

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all orders',
      data: orders
    })
  }

  public async getMyOrders(req: Request, res: Response) {
    const orders = await orderService.getMyOrders(req.currentUser)

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get my orders',
      data: orders
    })
  }

  public async getOrderItem(req: Request, res: Response) {
    const orderId = parseInt(req.params.orderId)
    const orderItemId = parseInt(req.params.orderItemId)

    const orderItem = await orderService.getOrderItem(orderId, orderItemId, req.currentUser)

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get order item',
      data: orderItem
    })
  }
}

export const orderController: OrderController = new OrderController()
