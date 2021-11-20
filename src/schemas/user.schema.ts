import { Schema } from 'mongoose';
import User, {UserModel} from '../interfaces/user.interface';
import AuthService from '../utils/auth';
import UModel from '../models/user.model';

const UserSchema = new Schema<User,UserModel>({
  name: { type: String, required: [true,'Name is required'], minlength: [4, 'Name Too Short'], maxlength: [20, 'Name Too Big'] },
  email: {
    type: String, required: [true,'Email is required'], unique: true, trim: true, validate: {
      validator: (v: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid Email'
    }
  },
  password: {
    type: String, required: [true,'Password is required'], trim: true, validate: {
      // validator: (v: any) => console.log(v),
      validator: (v: any) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(v),
      message: 'Weak Password'
    }
  },
  tokens: [{
    token: {
      type: String,
      _id: false
    }
  }]
}, { timestamps: true })

UserSchema.methods.generateToken = async function() : Promise<string> {
  const token = AuthService.generateToken(this._id);
  this.tokens = this.tokens.concat({token});
  await this.save();
  return token
}

UserSchema.methods.toJSON = function() : User{
  const user = this.toObject() as any;
  delete user.password,
  delete user.tokens
  return user;
};

UserSchema.pre('save',async function(next: Function){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await AuthService.hash(this.password);
    next();
})

UserSchema.statics.comparePassword = async function(email?: string,password?: string) : Promise<User> {
  if(!email || !password){
    throw new Error('Incomplete Input')
  }
  const user = await UModel.findOne({email});
  if(!user){
    throw new Error('No user exist with this email')
  }
  await AuthService.compareHashedPassword(user.password,password!);
  return user;
}

export default UserSchema;
