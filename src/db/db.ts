import mongoose from 'mongoose';
import config from '../config/config';

class DB {
  private static instance: DB;
  constructor() {
    this.connect();
  }
  static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }
  private async connect() {
    try {
      await mongoose.connect(`mongodb+srv://${config.username}:${config.password}@cluster0.kcyiz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
      console.log('Connected to Database Succesfully')
    } catch (e) {
      console.log(e);
    }
  }
}

export default DB;
