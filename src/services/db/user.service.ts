import { User } from '@prisma/client'
import { prisma } from '~/prisma'
import bcrypt from 'bcrypt'
import { authService } from './auth.service'
import { BadRequestException, ForbiddenException, NotFoundException } from '~/globals/middlewares/error.middleware'
import { IUserCreateBody, IUserUpdateBody, IUserUpdatePasswordBody } from '~/features/user/interface/user.interface'
import { Express } from 'express'

class UserService {
  public async add(requestBody: IUserCreateBody) {
    const { email, password, firstName, lastName, avatar } = requestBody

    if (await authService.isEmailAlreadyExist(email)) {
      throw new BadRequestException('Email must be unique')
    }

    const hashedPassword: string = await bcrypt.hash(password, 10)

    // Insert To DB
    const newUser: User = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        avatar
      }
    })

    // Create cart
    await prisma.cart.create({
      data: {
        userId: newUser.id,
        totalPrice: 0
      }
    })

    return this.returnUser(newUser)
  }

  public async edit(id: number, requestBody: IUserUpdateBody, currentUser: UserPayload) {
    const { firstName, lastName, avatar } = requestBody

    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You cannot perform this action')
    }

    const user: User = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        avatar
      }
    })

    return this.returnUser(user)
  }

  public async editPassword(requestBody: IUserUpdatePasswordBody, currentUser: UserPayload) {
    const { currentPassword, newPassword, confirmNewPassword } = requestBody

    const userInDB = await this.get(currentUser.id)

    if (!userInDB) {
      throw new NotFoundException('User does not exist')
    }

    const isMatchPassword: boolean = await bcrypt.compare(currentPassword, userInDB.password)

    if (!isMatchPassword) {
      throw new NotFoundException('Password wrong!')
    }

    if (newPassword !== confirmNewPassword) {
      throw new NotFoundException('Passwords are not same!')
    }

    const hashedNewPassword: string = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        password: hashedNewPassword
      }
    })
  }

  public async remove(id: number, currentUser: UserPayload) {
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You cannot perform this action')
    }

    // User cannot be delete
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    })
  }

  public async editAvatar(file: Express.Multer.File | undefined, currentUser: UserPayload) {
    if (!file) {
      throw new BadRequestException('Please provide image')
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        avatar: file.filename
      }
    })
  }

  public async get(id: number, include = {}) {
    const user = await prisma.user.findFirst({ where: { id }, include })

    return user
  }

  private returnUser(user: User) {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar
    }
  }
}

export const userService: UserService = new UserService()
