import { UserBaseDocument } from '../interfaces/user.interface';
import { Express,Request } from 'express';
import { Schema,Model,Document, Mongoose, Query,DocumentQuery } from 'mongoose';
import { CacheOptions } from 'src/utils/cache';

declare global{
    namespace Express {
        interface Request {
            user: UserBaseDocument;
            token: string;
        }
    }
    // namespace Mongoose {
    //     interface DocumentQuery<T, DocType> {
    //         cache(): Query<T>
    //         useCache: boolean
    //     }
    // }
}

declare module 'mongoose'{
    interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType>{
        cache(options: CacheOptions) : Query<ResultType, DocType>
        useCache: boolean
        hashKey: string
    }
}

// declare module 'mongoose' {
//     interface DocumentQuery<T, DocType> {
//         cache(): Query<T>
//         useCache: boolean
//     }
// }  

// import 'express';

// declare module 'express' {
//     interface Request {
//         user: UserProperties;
//         token: string;
//     }
// }

// declare module "express" {
//   export interface Request {
//     user: UserProperties;
//     token: string;
//   }
// }

// declare module 'express-serve-static-core' {
// export interface Request {
// user?: yourCustomType;
// }
// }
