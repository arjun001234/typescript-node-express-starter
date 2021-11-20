import { model } from 'mongoose';
import UserSchema from '../schemas/user.schema'
import User , {UserModel} from '../interfaces/user.interface';

const UModel = model<User,UserModel>('User',UserSchema)

export default UModel;
