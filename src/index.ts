import express, { Application } from "express";
import 'express-async-errors'
import Server from "./server";
import { email } from "./globals/helpers/email";

class ShopApplication {
  public run(): void {
    const app: Application = express();
    const server: Server = new Server(app);

    server.start();
  }
}

const shopApplication: ShopApplication = new ShopApplication();

shopApplication.run();