import {Request,Response,NextFunction} from 'express';
import {CreateUserRequest, UpdateUserRequest} from '../routers/user';
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
  validateUserCredentials() {
    return (req: CreateUserRequest,res: Response,next: NextFunction) => {
        const user = req.body;
        if(user.name){
          if(user.name && user.name.length < 4 ){
            return res.status(400).send({
              message: 'Name too short'
            })
          }
          if(user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)){
            return res.status(400).send({
              message: 'Invalid Email'
            })
          }
          if(user.password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(user.password)){
            return res.status(400).send({
              message: 'Weak Password'
            })
          }
        }
        next();
    }
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
