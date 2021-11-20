import {RequestHandler,Request,Response,NextFunction} from 'express';
import {UpdateUserRequest} from '../routers/user';
import AuthService from '../utils/auth';
import {JwtPayload} from 'jsonwebtoken';
import UserModel from '../models/user.model';
import RedisService from '../redis/redis';

class MiddleWare {
  private static instance: MiddleWare;
  static getInstance(): MiddleWare {
    if (!MiddleWare.instance) {
      MiddleWare.instance = new MiddleWare();
    }
    return MiddleWare.instance
  }
  validateUpdateUser() {
    return (req: UpdateUserRequest,res: Response,next: NextFunction) => {
      const providedInputs = Object.keys(req.body);
      if(!req.body || providedInputs.length === 0){
          res.status(400).send({
            message: 'No Input Provided'
          });
      }
      const allowedInputs : string[] = ['name','email','password']
      providedInputs.forEach((input) => {
        const valid = allowedInputs.includes(input);
        if(!valid){
          res.status(400).send({
            message: 'Invalid Input'
          });
        }
      })
      next();
    }
  }
  auth() {
    return async (req: Request,res: Response,next: NextFunction) => {
        if(!req.headers['authorization']){
            res.status(400).send({
              message: 'Token not provided'
            });
        }else{
            const token = req.headers['authorization'].split(' ')[1]
            const {id} : JwtPayload = AuthService.verifyToken(token) as JwtPayload;
            const user = await UserModel.findOne({_id: id})
            if(!user){
              res.status(400).send({
                message: 'User not Found'
              });
            }else{
              req.user = user;
              req.token = token;
            }
        }
        next();
    }
  }
  cleanCache() {
    return async (req: Request,res: Response,next: NextFunction) => {
      await next();
      RedisService.clearCache(req.user.id!);
    }
  }
}

export default MiddleWare.getInstance();
