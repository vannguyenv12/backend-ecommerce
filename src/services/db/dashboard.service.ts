import { prisma } from "~/prisma"

class DashboardService {
  public async getInfo() {
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count({
      where: {
        isActive: true
      }
    });
    //get total revenue of all product
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        totalPrice: true
      }
    })

    // get total revenue of every product
    // {shopId: 1, productId: 1, totalPrice:  2232}
    // {shopId: 2, productId: 2, totalPrice:  242}

    const totalRevenueByProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        price: true,
        quantity: true,
      },
      orderBy: {
        _sum: {
          price: 'desc',
        }
      }
    });

    console.log(totalRevenueByProducts)

    const productWithShopIds = await prisma.product.findMany({
      where: {
        id: {
          in: totalRevenueByProducts.map((item) => item.productId)
        }
      },
      select: {
        id: true,
        shopId: true
      }
    })

    const arrTotal = totalRevenueByProducts.map((item) => {
      const totalRevenue = (item._sum.price || 0) * (item._sum.quantity || 1);
      const product = productWithShopIds.find((productItem) => productItem.id === item.productId);

      return {
        shopId: product?.shopId,
        productId: item.productId,
        totalPrice: totalRevenue
      }
    })


    return {
      productsCount, usersCount,
      totalRevenue: totalRevenue._sum.totalPrice, totalRevenueByProducts: arrTotal
    }
  }
}

export const dashboardService: DashboardService = new DashboardService()