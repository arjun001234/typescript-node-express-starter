import {Model,Document} from 'mongoose';

export interface UserProperties {
  name: string,
  email: string,
  password: string,
  tokens: {token: string}[],
  createdAt: Date,
  updatedAt: Date
}

export interface UserBaseDocument extends UserProperties, Document {
  generateToken(): Promise<string>
}

export default interface User extends UserBaseDocument {};

export interface UserModel extends Model<User> {
  comparePassword(email?: string,password?: string): Promise<User>
}
