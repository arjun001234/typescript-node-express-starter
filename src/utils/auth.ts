import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';
import config from '../config/config';

class AuthService {
  private my_secret: jwt.Secret = config.jwt_secret!;
  private saltRounds = 10;

  private static instance: AuthService;
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance
  }

  generateToken(id: Schema.Types.ObjectId) {
    return jwt.sign({ id: id }, this.my_secret);
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.my_secret);
  }

  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  async compareHashedPassword(hashValue: string, password: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, hashValue);
    if (!isPasswordValid) {
      throw new Error('Invalid Password');
    }
  }
}

export default AuthService.getInstance();
