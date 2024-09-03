import { NextFunction, Request, Response } from "express";
import { ForbiddenException, NotFoundException, UnAuthorizedException } from "./error.middleware";
import jwt from 'jsonwebtoken';
import { userService } from "~/services/db/user.service";


export function verifyUser(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies.accessToken) {
    throw new UnAuthorizedException('Token is invalid, please login again!');
  }

  const token = req.cookies.accessToken
  try {
    const userDecoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.currentUser = userDecoded;
    next();
  } catch (error) {
    throw new UnAuthorizedException('Token is invalid, please login again!');
  }
}

export function checkUserAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser) {
    throw new ForbiddenException('You are not logged');
  }

  next();
}

export function checkPermission(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser.role)) {
      throw new ForbiddenException('You cannot perform this action')
    }

    next();
  }
}

export async function preventInActiveUser(req: Request, res: Response, next: NextFunction) {
  const user = await userService.get(req.currentUser.id);

  if (!user) {
    throw new NotFoundException('User does not exist');
  }

  if (!user.isActive) {
    throw new ForbiddenException('You was banned');
  }

  next();
}