import { Cart, Coupon, Order, OrderItem } from '@prisma/client'
import { cartService } from './cart.service'
import { prisma } from '~/prisma'
import { couponService } from './coupon.service'
import { BadRequestException, NotFoundException } from '~/globals/middlewares/error.middleware'
import { Helper } from '~/globals/helpers/helper'
import { addressService } from './address.service'

class OrderService {
  public async add(requestBody: any, currentUser: UserPayload) {
    const { couponCode, addressId } = requestBody

    const addresses = await addressService.getAll(currentUser)

    const address = await addresses.find((a) => a.id === addressId)

    const coupon: Coupon | null = await couponService.get(couponCode)
    if (!coupon) {
      throw new NotFoundException(`The coupon ${couponCode} does not exist`)
    }

    if (coupon.discountPrice <= 0) {
      throw new NotFoundException(`The coupon no longer exist`)
    }

    // Get all cart items in my cart
    const cart: any | null = await cartService.getMyCart(currentUser)

    // Make sure product.quantity > 0
    // cart quantity of product <= product.quantity

    for (const cartItem of cart.cartItems) {
      const product = await prisma.product.findFirst({
        where: { id: cartItem.productId }
      })

      if (!product) {
        throw new NotFoundException(`Product not found`)
      }

      if (product?.quantity <= 0) {
        throw new BadRequestException(`Product ${product.name} has out of stock`)
      }

      if (cartItem.quantity > product.quantity) {
        throw new BadRequestException(`Product ${product.name} does not enough`)
      }
    }

    // Create a Order

    const newOrder = await prisma.order.create({
      data: {
        address: JSON.stringify(address),
        totalPrice: 0,
        status: 'pending',
        userId: currentUser.id
      }
    })

    // Loop through the cart items and add it to orderItem
    const orderItems = []
    let totalQuantity: number = 0

    for (const cartItem of cart.cartItems) {
      orderItems.push({
        orderId: newOrder.id,
        productId: cartItem.productId,
        variant: cartItem.variant,
        price: cartItem.price,
        quantity: cartItem.quantity
      })

      totalQuantity += cartItem.quantity
    }

    await prisma.orderItem.createMany({
      data: orderItems
    })

    // Decrement quantity of product
    for (const cartItem of cart.cartItems) {
      await prisma.product.update({
        where: { id: cartItem.productId },
        data: {
          quantity: {
            decrement: cartItem.quantity
          }
        }
      })
    }

    // Clear carts
    cartService.clear(cart.id, currentUser)

    // update total price of order
    await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        totalQuantity: totalQuantity,
        totalPrice: Helper.getOrderTotalPrice(coupon, cart.totalPrice),
        couponCode
      }
    })
  }

  public async addWithNoCoupon(requestBody: any, currentUser: UserPayload) {
    const { addressId } = requestBody

    // Get all cart items in my cart
    const cart: any | null = await cartService.getMyCart(currentUser)

    const addresses = await addressService.getAll(currentUser)

    const address = await addresses.find((a) => a.id === addressId)

    // Make sure product.quantity > 0
    // cart quantity of product <= product.quantity

    for (const cartItem of cart.cartItems) {
      const product = await prisma.product.findFirst({
        where: { id: cartItem.productId }
      })

      if (!product) {
        throw new NotFoundException(`Product not found`)
      }

      if (product?.quantity <= 0) {
        throw new BadRequestException(`Product ${product.name} has out of stock`)
      }

      if (cartItem.quantity > product.quantity) {
        throw new BadRequestException(`Product ${product.name} does not enough`)
      }
    }

    // Create a Order

    const newOrder = await prisma.order.create({
      data: {
        address: JSON.stringify(address),
        totalPrice: 0,
        status: 'pending',
        userId: currentUser.id
      }
    })

    // Loop through the cart items and add it to orderItem
    const orderItems = []
    let totalQuantity: number = 0

    for (const cartItem of cart.cartItems) {
      orderItems.push({
        orderId: newOrder.id,
        productId: cartItem.productId,
        variant: cartItem.variant,
        price: cartItem.price,
        quantity: cartItem.quantity
      })

      totalQuantity += cartItem.quantity
    }

    await prisma.orderItem.createMany({
      data: orderItems
    })

    // Decrement quantity of product
    for (const cartItem of cart.cartItems) {
      await prisma.product.update({
        where: { id: cartItem.productId },
        data: {
          quantity: {
            decrement: cartItem.quantity
          }
        }
      })
    }

    // Clear carts
    cartService.clear(cart.id, currentUser)

    // update total price of order
    await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        totalQuantity: totalQuantity,
        totalPrice: cart.totalPrice
      }
    })
  }

  public async update(orderId: number, requestBody: any) {
    const { status } = requestBody

    if (status !== 'pending' && status !== 'delivered') {
      throw new BadRequestException('status does not support')
    }

    const order = await this.get(orderId)

    if (!order) {
      throw new NotFoundException(`Order with ID: ${orderId} not found`)
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
  }

  public async getMyOrders(currentUser: UserPayload) {
    const orders: Order[] = await prisma.order.findMany({
      where: { userId: currentUser.id }
    })

    return orders
  }

  public async getOrderItem(orderId: number, orderItemId: number, currentUser: UserPayload) {
    const order: any = await this.get(orderId, { orderItems: true })

    if (!order) {
      throw new NotFoundException(`Order with ID: ${orderId} not found`)
    }
    Helper.checkPermission(order, 'userId', currentUser)

    const orderIndex = order?.orderItems?.findIndex((item: any) => item.id === orderItemId)

    if (orderIndex === 'undefined' || orderIndex <= -1) {
      throw new NotFoundException(`Order Item Not Found`)
    }

    const orderItem: OrderItem | null = await prisma.orderItem.findFirst({
      where: { id: orderItemId },
      include: {
        product: true
      }
    })

    if (!orderItem) {
      throw new NotFoundException(`Order item ${orderItemId} not found`)
    }

    return orderItem
  }

  public async getAllOrders() {
    const orders: Order[] = await prisma.order.findMany()

    return orders
  }

  private async get(orderId: number, include = {}) {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include
    })

    return order
  }
}

export const orderService: OrderService = new OrderService()
