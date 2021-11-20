import express, { Application } from 'express';
import '../utils/cache';
import '../utils/google';
import UserRouter from '../routers/user';
import CookieParser from 'cookie-parser';
import DB from '../db/db';
import config from '../config/config';

class Server {
  private app: Application;
  private static instance: Server;
  constructor() {
    this.app = express();
    this.configureServer();
    this.setRouters();
    this.startServer();
    DB.getInstance();
  }
  static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance
  }
  private configureServer() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(CookieParser());
  }
  private setRouters() {
    this.app.use(new UserRouter().router)
  }
  private startServer() {
    this.app.listen(config.port, () => {
      console.log('Server is up and running')
    })
  }
}

export default Server;
