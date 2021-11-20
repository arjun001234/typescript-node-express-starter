import { ClientOpts, RedisClient } from "redis";
import config from "../config/config";
import { promisify } from "util";

class AsyncRedis extends RedisClient {
  public readonly getAsync = promisify(this.get).bind(this);
  public readonly setAsync = promisify(this.set).bind(this);
  public readonly getHashAsync = promisify(this.hget).bind(this);
  public readonly setHashAsync = promisify(this.hset).bind(this);
}

class Redis {
  private client: AsyncRedis;
  private url: ClientOpts = { url: config.redis_url };
  private static instance: Redis;
  constructor() {
    this.client = new AsyncRedis(this.url);
  }
  static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }
  async setValue(key: string, value: string): Promise<boolean> {
    const result = await this.client.setAsync(key, JSON.stringify(value)) as boolean;
    return result
  }
  async getValue(key: string): Promise<any> {
    const data = await this.client.getAsync(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
  async setHashValue(hashKey: string,key: string,value: string) {
      const result = await this.client.setHashAsync([hashKey,key,value]) 
      return result
  }
  async getHashValue(hashKey: string,key: string) : Promise<any>{
    const data = await this.client.getHashAsync(hashKey,key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
  clearCache(hashKey: string) : void{
    this.client.del(hashKey)
  }
  close() {
    this.client.flushall();
  }
}

export default Redis.getInstance();
