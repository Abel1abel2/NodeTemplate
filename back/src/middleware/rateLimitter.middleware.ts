
import { createLimiter } from '../lib/createLimiter.js'

  


//for sensitive endpoints like login, password reset, etc.
export const strictRateLimiter=createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // limit each IP to 5 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes."
})
//for active user operations like profile updates, etc.
export const moderateRateLimiter=createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // limit each IP to 20 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes."
})

//for general endpoints like fetching data, etc.
export const generalRateLimiter=createLimiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after a minute."
})

//for api endpoints
export const apiRateLimiter=createLimiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 1000, 
    message: "Too many requests from this IP, please try again after a minute."
})