import { Review } from "@prisma/client";
import { IReviewBody } from "~/features/review/interface/review.interface";
import { Helper } from "~/globals/helpers/helper";
import { BadRequestException, NotFoundException } from "~/globals/middlewares/error.middleware";
import { prisma } from "~/prisma";

class ReviewService {
  public async add(requestBody: IReviewBody, currentUser: UserPayload) {
    // 1) Make sure user already bought product
    const { productId, rating, comment } = requestBody;

    const orders = await prisma.order.findMany({
      where: {
        userId: currentUser.id,
        orderItems: {
          some: {
            productId
          }
        }
      }
    });

    if (orders.length === 0) {
      throw new BadRequestException(`You does not buy this product`);
    }

    const existingReview = await this.getReviewByProductAndUser(productId, currentUser.id);

    if (existingReview) {
      throw new BadRequestException(`You already has a review on this product`);
    }

    // 2) Create a review
    const review = await prisma.review.create({
      data: {
        productId, comment, rating, userId: currentUser.id
      }
    });

    return review;

  }

  public async update(reviewId: number, requestBody: IReviewBody, currentUser: UserPayload) {
    const { rating, comment } = requestBody;

    const foundReview: Review | null = await this.get(reviewId);

    if (!foundReview) {
      throw new NotFoundException(`The review: ${reviewId} not found`);
    }

    Helper.checkPermission(foundReview, 'userId', currentUser);


    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating, comment
      }
    });

    return review;
  }

  public async remove(reviewId: number, currentUser: UserPayload) {
    const foundReview: Review | null = await this.get(reviewId);

    if (!foundReview) {
      throw new NotFoundException(`The review: ${reviewId} not found`);
    }

    Helper.checkPermission(foundReview, 'userId', currentUser);

    await prisma.review.delete({
      where: { id: reviewId }
    })
  }

  public async getAvgRating(productId: number): Promise<number | null> {
    const aggregations = await prisma.review.aggregate({
      _avg: {
        rating: true
      },
      where: {
        productId
      }
    });

    return aggregations._avg.rating;
  }

  private async get(reviewId: number) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId }
    });

    return review;
  }

  private async getReviewByProductAndUser(productId: number, userId: number) {
    const review = await prisma.review.findFirst({
      where: { productId, userId }
    });

    return review;
  }


}

export const reviewService: ReviewService = new ReviewService();