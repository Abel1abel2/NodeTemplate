import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import type { Express, Request, Response } from "express"
import { PORT } from "./secret.js"
import rootRouter from "./Routes/index.route.js"
import { PrismaClient } from "./generated/prisma/client.js"
import { SECURITY_CONFIG, ValidateSecurityConfig } from "./config/security.config.js"
import { helmetSecurity } from "./middleware/security.middleware.js"
import { permissionsPolicy } from "./middleware/security.middleware.js"
import prisma from "./lib/prisma.js"
import { apiRateLimiter } from "./middleware/rateLimitter.middleware.js"
import { ApiError } from "./utils/ApiError.js"
import { errorConverter, errorHandler } from "./middleware/error.middleware.js"
//initialize dotenv
dotenv.config()

//validating the secret 
ValidateSecurityConfig()

const app:Express=express()

//trust proxy :for deploying behind a reverse proxy (like Nginx, Heroku, etc.), this setting is important for correctly identifying the client's IP address and protocol. It is especially relevant when using secure cookies or handling requests that depend on the original client information.
app.set("trust proxy", Number(process.env.TRUST_PROXY) || 1);

                                        //third party middleware
//security middleware
app.use(helmetSecurity())
app.use(permissionsPolicy())//permissions policy middleware
app.use(
  cors({
    origin: SECURITY_CONFIG.CORS.ALLOWED_ORIGINS,
    credentials: SECURITY_CONFIG.CORS.CREDENTIALS,
  }),
);
//logging middleware
app.use(morgan("dev"))
//parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

                            //endpoints
//special routes
app.get("/health",(_req,res)=>{//unrestricted checkpoint
   res.json({ status: "healthy", timestamp: new Date().toISOString(), version: "2.0.0" });
})
app.get("/",(_req,res)=>{
    res.json({ status: "healthy", timestamp: new Date().toISOString(), version: "2.0.0" });
})//root health check route
//rate limiters
app.use("/api",apiRateLimiter)//api rate limiter
//routes
app.use("/api",rootRouter)//root router for all api routes



                    //error handling
app.use((req,res,next)=>{
  next(new ApiError(404,"Route Not Found"))
})
app.use(errorConverter)
app.use(errorHandler)

                  //db connections check
prisma.$connect()
.then(()=>console.log("Database connected successfully"))
.catch((err:Error)=>{
console.error("Database connection error:", err);
})





          //listening the server 
app.listen(PORT,()=>{
    console.log(`app route at ${PORT} port`)
})