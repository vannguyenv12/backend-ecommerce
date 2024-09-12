import { User } from '@prisma/client'
import { prisma } from '~/prisma'
import jwt from 'jsonwebtoken'
import { NextFunction } from 'express'
import { BadRequestException, ForbiddenException, NotFoundException } from '~/globals/middlewares/error.middleware'
import { IAuthLogin, IAuthRegister } from '~/features/user/interface/auth.interface'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { email as emailSender } from '~/globals/helpers/email'

class AuthService {
  public async addUser(requestBody: IAuthRegister) {
    const { email, password, firstName, lastName, avatar } = requestBody

    const userByEmail: User | null = await this.getUserByEmail(email)
    if (userByEmail) {
      throw new NotFoundException('Email must be unique')
    }

    const hashedPassword: string = await bcrypt.hash(password, 10)

    const newUser: User = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        avatar,
        role: email.startsWith('admin') ? 'ADMIN' : 'USER'
      }
    })

    // Create JWT
    const payload = {
      id: newUser.id,
      email,
      firstName,
      lastName,
      avatar,
      role: email.startsWith('admin') ? 'ADMIN' : newUser.role
    }

    // Create cart
    await prisma.cart.create({
      data: {
        userId: newUser.id,
        totalPrice: 0
      }
    })

    const accessToken: string = this.generateJWT(payload)

    return accessToken
  }

  public async login(requestBody: IAuthLogin) {
    // 1) Get user by email
    const user: User | null = await this.getUserByEmail(requestBody.email)
    // 2) Check email exist
    if (!user) {
      throw new BadRequestException('Invalid Credentials')
    }

    if (!user.isActive) {
      throw new ForbiddenException('This account was banned')
    }

    // 3) Check password
    const isMatchPassword: boolean = await bcrypt.compare(requestBody.password, user.password)
    if (!isMatchPassword) {
      throw new BadRequestException('Invalid Credentials')
    }
    // 4) Generate JWT -> Access Token

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role
    }
    const accessToken: string = await this.generateJWT(payload)

    return accessToken
  }

  private async getUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email
      }
    })
  }

  private generateJWT(payload: any) {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' })
  }

  public async isEmailAlreadyExist(email: string) {
    const userByEmail = await prisma.user.findFirst({
      where: {
        email
      }
    })

    return userByEmail != null
  }

  public async forgetPassword(email: string) {
    const user = await this.getUserByEmail(email)
    if (!user) throw new NotFoundException(`The user with email ${email} not found`)

    // 1) Create the code for reset password
    const resetCode = crypto.randomBytes(6).toString('hex')
    // 2) Save reset password to user's database
    const tenMinutes = 1000 * 60 * 10
    const expiresDate = new Date(Date.now() + tenMinutes)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetCode: resetCode, passwordResetDate: expiresDate }
    })
    // 3) Send Email
    await emailSender.send(
      'admin@gmail.com',
      user.email,
      'Forgot Password',
      'Your reset password token',
      `<h1>${resetCode}</h1>`
    )
  }

  public async resetPassword(requestBody: any) {
    const { passwordResetCode, newPassword, confirmNewPassword } = requestBody

    const user = await prisma.user.findFirst({ where: { passwordResetCode } })
    if (!user) throw new NotFoundException('Password Reset Code Invalid')

    if (user.passwordResetDate! < new Date(Date.now())) {
      throw new BadRequestException('Password Reset Code already expired, please forgot again!')
    }

    if (newPassword !== confirmNewPassword) throw new BadRequestException('Password must be same!')

    const hashedPassword: string = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetDate: null
      }
    })
  }
}

export const authService: AuthService = new AuthService()
