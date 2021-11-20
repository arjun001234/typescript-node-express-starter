import express, { Router, Request, Response } from "express";
import { UserProperties } from "../interfaces/user.interface";
import UserModel from "../models/user.model";
import MiddleWare from "../middleware/middleware";

interface CreateUserRequest extends Request {
  body: UserProperties;
}
interface LoginUserRequest extends Request {
  body: Pick<UserProperties, "email" | "password">;
}

export interface UpdateUserRequest extends Request {
  body: Partial<UserProperties>;
}
interface SearchUserRequest extends Request {
  query: {
    name: string;
  };
}

export default class UserRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.loginUser();
    this.setUser();
    this.updateUser();
    this.deleteUser();
    this.getMe();
    this.logout();
    this.logoutAll();
    this.getUsers();
  }

  private loginUser(): void {
    this.router.post(
      "/users/login",
      async (req: LoginUserRequest, res: Response) => {
        try {
          const user = await UserModel.comparePassword(
            req.body.email,
            req.body.password
          );
          if (!user) {
            return res.status(400).send("User not registered.");
          }
          const token = await user.generateToken();
          res.send({ user, token });
        } catch (error: any) {
          res.status(400).send(error.message);
        }
      }
    );
  }

  private logout(): void {
    this.router.post(
      "/users/logout",
      MiddleWare.auth(),
      MiddleWare.cleanCache(),
      async (req: Request, res: Response) => {
        try {
          req.user.tokens.filter((token) => token.token !== req.token);
          console.log(req.user,req.token);
          await req.user.save();
          console.log(req.user);
          res.send(req.user);
        } catch (error) {
          res.status(400).send(error);
        }
      }
    );
  }

  private logoutAll(): void {
    this.router.post(
      "/users/logoutAll",
      MiddleWare.auth(),
      MiddleWare.cleanCache(),
      async (req: LoginUserRequest, res: Response) => {
        try {
          req.user.tokens = [];
          await req.user.save();
          res.send(req.user);
        } catch (error) {
          console.log(error);
          res.status(400).send(error);
        }
      }
    );
  }

  private getUsers(): void {
    this.router.get("/users", async (req: SearchUserRequest, res: Response) => {
      try {
        let users;
        req.query && req.query.name
          ? (users = await UserModel.find({
              name: req.query.name,
            }))
          : (users = await UserModel.find());
        res.send(users);
      } catch (error) {
        res.status(400).send(error);
      }
    });
  }

  private getMe(): void {
    this.router.get(
      "/users/me",
      MiddleWare.auth(),
      async (req: Request, res: Response) => {
        try {
          const user = req.user;
          res.send(user);
        } catch (error) {
          res.status(400).send(error);
        }
      }
    );
  }

  private setUser(): void {
    this.router.post(
      "/users",
      async (req: CreateUserRequest, res: Response) => {
        try {
          const user = new UserModel(req.body);
          const token = await user.generateToken();
          await user.save();
          res.send({ user, token });
        } catch (error) {
          res.status(400).send(error);
        }
      }
    );
  }

  private updateUser(): void {
    this.router.patch(
      "/users",
      MiddleWare.auth(),
      MiddleWare.validateUpdateUser(),
      MiddleWare.cleanCache(),
      async (req: UpdateUserRequest, res: Response) => {
        try {
          //not the best solution
          await UserModel.findByIdAndUpdate(req.user._id, req.body);
          const user = await UserModel.findById(req.user._id);
          res.send(user);
        } catch (error) {
          res.status(400).send(error);
        }
      }
    );
  }

  private deleteUser(): void {
    this.router.delete(
      "/users",
      MiddleWare.auth(),
      MiddleWare.cleanCache(),
      async (req: Request, res: Response) => {
        try {
          await UserModel.findByIdAndDelete(req.user._id);
          res.send(req.user);
        } catch (error) {
          res.status(400).send(error);
        }
      }
    );
  }
}
