import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "~/globals/constants/http";
import { userService } from "~/services/db/user.service";

class UserController {
  public async createUser(req: Request, res: Response) {

    const newUser = await userService.add(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      message: 'Create new user',
      data: newUser
    }); // CREATED
  }

  public async getMe(req: Request, res: Response) {
    return res.status(HTTP_STATUS.OK).json(req.currentUser)
  }

  public async update(req: Request, res: Response) {
    const updatedUser = await userService.edit(parseInt(req.params.id), req.body, req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update user',
      data: updatedUser
    })
  }

  public async changePassword(req: Request, res: Response) {
    await userService.editPassword(req.body, req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update password',
    })
  }

  public async delete(req: Request, res: Response) {
    await userService.remove(parseInt(req.params.id), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete user',
    })
  }

  public async uploadAvatar(req: Request, res: Response) {
    await userService.editAvatar(req.file, req.currentUser);

    res.status(HTTP_STATUS.OK).json({
      message: 'Update avatar'
    });
  }

}

export const userController: UserController = new UserController();