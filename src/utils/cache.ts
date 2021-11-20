import {Query} from 'mongoose';
const exec = Query.prototype.exec;
import RedisService from '../redis/redis';

export interface CacheOptions {
    key: string
}

Query.prototype.cache = function(options) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this
}

Query.prototype.exec = async function(){
    if(!this.useCache){
        return exec.apply(this)
    }
    console.log(this.getQuery(),this.useCache);
    const key = JSON.stringify(Object.assign({},this.getQuery(),{
        collection: this.model.collection.name
    }));
    const cachedData = await RedisService.getHashValue(this.hashKey,key);
    if(cachedData){
        const doc = cachedData;
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc)
    }
    const result = await exec.apply(this);

    await RedisService.setHashValue(this.hashKey,key,JSON.stringify(result));

    return result;
}