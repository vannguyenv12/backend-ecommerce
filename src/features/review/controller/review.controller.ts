import { Request, Response } from "express";
import { HTTP_STATUS } from "~/globals/constants/http";
import { reviewService } from "~/services/db/review.service";

class ReviewController {
  public async addReview(req: Request, res: Response) {
    const review = await reviewService.add(req.body, req.currentUser);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Add review',
      data: review
    });
  }

  public async updateReview(req: Request, res: Response) {
    const review = await reviewService.update(parseInt(req.params.id), req.body, req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update review',
      data: review
    })
  }

  public async deleteReview(req: Request, res: Response) {
    await reviewService.remove(parseInt(req.params.id), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete review',
    })
  }

  public async getAvg(req: Request, res: Response) {
    const avg = await reviewService.getAvgRating(parseInt(req.params.id));

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get avg product',
      data: avg
    })
  }
}

export const reviewController: ReviewController = new ReviewController();