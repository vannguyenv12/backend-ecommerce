import { Cart, CartItem, Product, User } from '@prisma/client'
import { prisma } from '~/prisma'
import { productService } from './product.service'
import { NotFoundException } from '~/globals/middlewares/error.middleware'
import { userService } from './user.service'
import { Helper } from '~/globals/helpers/helper'
import { ICartBody } from '~/features/cart/interface/cart.interface'

class CartService {
  public async add(requestBody: ICartBody, currentUser: UserPayload) {
    const { productId, variant, quantity } = requestBody
    // Checkbox Size: M, L
    // {"Size": "L"}

    // Check product
    const product: Product | null = await productService.getProduct(productId)
    if (!product) {
      throw new NotFoundException(`Product has ID: ${productId} not found`)
    }

    // If user already has a cart, don't create
    const user: any | null = await userService.get(currentUser.id, { Cart: true })
    if (!user) {
      throw new NotFoundException(`User does not exist`)
    }

    let cart: any

    if (user?.Cart?.id) {
      const existingCart: Cart | null = await this.getCart(user.Cart.id, { cartItems: true })
      if (!existingCart) {
        throw new NotFoundException(`Cart does not exist`)
      }
      cart = existingCart
    } else {
      // 1) Create cart, totalPrice: 0
      cart = await prisma.cart.create({
        data: {
          totalPrice: 0,
          userId: currentUser.id
        }
      })
    }

    // 2) Create CartItem
    const itemIndex: number | undefined = cart?.cartItems?.findIndex((item: any) => item.productId === productId)
    let cartItem: CartItem

    if (itemIndex == undefined || itemIndex <= -1) {
      cartItem = await prisma.cartItem.create({
        data: {
          productId,
          variant,
          cartId: cart.id,
          price: product.price,
          quantity
        }
      })
    } else {
      const currentCartItem = await this.getCartItemByProduct(cart.id, productId)

      if (!currentCartItem) {
        throw new NotFoundException('Cart item not found')
      }

      cartItem = await prisma.cartItem.update({
        where: { id: currentCartItem.id },
        data: {
          quantity: currentCartItem.quantity + (quantity || 1)
        }
      })
    }

    // 3) Calculate total price of cartItem, assign it to totalPrice of cart

    const currentCart: Cart | null = await this.getCart(cartItem.cartId)
    if (!currentCart) {
      throw new NotFoundException(`Cart does not exist`)
    }

    await prisma.cart.update({
      where: { id: cartItem.cartId },
      data: {
        totalPrice: await this.calcTotalPrice(currentUser)
      }
    })
  }

  private async calcTotalPrice(currentUser: UserPayload) {
    const cart = await this.get(currentUser)

    let totalPrice = 0
    for (const cartItem of cart.cartItems) {
      totalPrice += cartItem.price * cartItem.quantity
    }

    return totalPrice
  }

  public async clear(cartId: number, currentUser: UserPayload) {
    const cart: Cart | null = await this.getCart(cartId)

    if (!cart) {
      throw new NotFoundException(`Cart id: ${cartId} not found`)
    }

    Helper.checkPermission(cart, 'userId', currentUser)

    await prisma.cart.delete({
      where: {
        id: cartId
      }
    })

    await prisma.cart.create({
      data: {
        userId: currentUser.id,
        totalPrice: 0
      }
    })
  }

  public async removeItem(cartItemId: number, currentUser: UserPayload) {
    const cartItem: any | null = await this.getCartItem(cartItemId, { cart: true })

    if (!cartItem) {
      throw new NotFoundException(`Cart item id: ${cartItemId} not found`)
    }

    const cart: Cart = (await this.getCart(cartItem.cartId)) as Cart

    await prisma.cart.update({
      where: {
        id: cart.id
      },
      data: {
        totalPrice: cart.totalPrice - cartItem.price * cartItem.quantity
      }
    })

    Helper.checkPermission(cartItem.cart, 'userId', currentUser)

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })
  }

  public async get(currentUser: UserPayload) {
    const cart = await prisma.cart.findFirst({
      where: { userId: currentUser.id },
      include: {
        cartItems: {
          include: {
            product: true
          }
        }
      }
    })

    return this.returnCart(cart)
  }

  public async getMyCart(currentUser: UserPayload) {
    const cart = await prisma.cart.findFirst({
      where: { userId: currentUser.id },
      include: {
        cartItems: {
          include: {
            product: true
          }
        }
      }
    })

    return cart
  }

  private async getCart(cartId: number, include = {}) {
    const cart: Cart | null = await prisma.cart.findFirst({
      where: { id: cartId },
      include
    })

    return cart
  }

  private async getCartItem(cartItemId: number, include = {}) {
    const cartItem: CartItem | null = await prisma.cartItem.findFirst({
      where: { id: cartItemId },
      include
    })

    return cartItem
  }

  private async getCartItemByProduct(cartId: number, productId: number) {
    const cartItem: CartItem | null = await prisma.cartItem.findFirst({
      where: { cartId, productId }
    })

    return cartItem
  }

  private async returnCart(cart: any) {
    const cartItems = cart?.cartItems.map((item: any) => {
      return {
        ...item,
        productName: item.product.name,
        productImage: item.product.main_image,
        product: undefined
      }
    })
    return {
      ...cart,
      cartItems: cartItems
    }
  }
}

export const cartService: CartService = new CartService()
