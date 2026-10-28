import rateLimit from "express-rate-limit";
import type { Options } from "express-rate-limit";
import type { Request,Response,NextFunction } from "express";

//fallback handler for when the rate limit is exceeded
const fallbackHandler=(req:Request,res:Response,_next:NextFunction,options:Options)=>{
     const messageStr =typeof options.message === 'string' 
        ? options.message
        : (options.message as { message?: string })?.message ?? 'Too many requests, please try again later.';
    
        res.status(options.statusCode).json({
        status: 'error',
        code: options.statusCode,
        message: messageStr,
    });
    }

//this is the limiter
export const createLimiter=(Options:{windowMs:number,limit:number,message:string})=>{
    return rateLimit({
        windowMs: Options.windowMs, // time window in milliseconds
        max: Options.limit, // limit each IP to 'limit' requests per windowMs
        message: Options.message, // message to send when limit is exceeded
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        handler:fallbackHandler, // custom handler for when the rate limit is exceeded
    });
}