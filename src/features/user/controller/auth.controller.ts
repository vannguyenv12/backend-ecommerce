import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "~/globals/constants/http";
import { sendTokenToCookie } from "~/globals/helpers/cookie";
import { BadRequestException } from "~/globals/middlewares/error.middleware";
import { authService } from "~/services/db/auth.service";

class AuthController {
  public async registerUser(req: Request, res: Response) {
    const accessToken = await authService.addUser(req.body);

    sendTokenToCookie(res, accessToken);

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User registered successfully!',
    });
  }

  public async loginUser(req: Request, res: Response) {
    const accessToken = await authService.login(req.body);

    sendTokenToCookie(res, accessToken);

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User login successfully!',
    });
  }

  public async forgetPassword(req: Request, res: Response) {
    await authService.forgetPassword(req.body.email);

    res.status(HTTP_STATUS.OK).json({
      message: 'Reset password code was sent'
    })
  }

  public async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body);

    res.status(HTTP_STATUS.OK).json({
      message: 'Reset password successfully'
    })
  }
}

export const authController: AuthController = new AuthController();