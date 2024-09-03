import express, { Application, NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import appRoutes from './globals/routes/appRoutes'
import { CustomError, IError, NotFoundException } from './globals/middlewares/error.middleware'
import { HTTP_STATUS } from './globals/constants/http'
import { MulterError } from 'multer'
import cors from 'cors'

class Server {
  private app: Application

  constructor(app: Application) {
    this.app = app
  }

  public start(): void {
    this.setupMiddleware()
    this.setupRoutes()
    this.setupGlobalError()
    this.startServer()
  }

  private setupMiddleware(): void {
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL!,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    )
    this.app.use(cookieParser())
    this.app.use(express.json()) // req.body
    this.app.use('/images', express.static('images'))
  }

  private setupRoutes(): void {
    appRoutes(this.app)
  }
  private setupGlobalError(): void {
    // Not Found
    this.app.all('*', (req, res, next) => {
      return next(new NotFoundException(`The url ${req.originalUrl} not found`))
    })

    // Global
    this.app.use((error: IError | MulterError, req: Request, res: Response, next: NextFunction) => {
      console.log('check error: ', error)
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.getErrorResponse())
      }

      if (error instanceof MulterError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: 'error',
          statusCode: HTTP_STATUS.BAD_REQUEST,
          message: error.message
        })
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    })
  }

  private startServer() {
    const port = parseInt(process.env.PORT!) || 5050

    this.app.listen(port, () => {
      console.log(`App listen to port ${port}`)
    })
  }
}

export default Server
