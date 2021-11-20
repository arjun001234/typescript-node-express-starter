import { CookieOptions } from 'express';
import configService from '../config/config'
// import {Handler,Request,Response,NextFunction} from 'express'

class Cookie {
  private config: CookieOptions
  private static instance: Cookie
  constructor() {
    var date: Date = new Date();
    date.setDate(date.getDate() + 30);
    this.config = {
      secure:  configService.environment ? true : false,
      httpOnly: true,
      expires: date
    }
  }
  static getInstance(): Cookie {
    if (!Cookie.instance) {
      Cookie.instance = new Cookie();
    }
    return Cookie.instance
  }
  getConfig(): CookieOptions {
    return this.config
  }
}

export default Cookie.getInstance();
