import { Response } from 'express'

export function sendTokenToCookie(res: Response, accessToken: string) {
  res.cookie('accessToken', accessToken, {
    maxAge: 86400000,
    httpOnly: true,
    secure: false
  })
}
