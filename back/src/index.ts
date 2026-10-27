import express from "express"
import dotenv from "dotenv"
import type { Express, Request, Response } from "express"
import { PORT } from "./secret.js"
import rootRouter from "./Routes/index.route.js"
import { PrismaClient } from "./generated/prisma/client.js"

//initialize dotenv
dotenv.config()

//validating env variables
const app:Express=express()
//third party middleware
app.use(express.json())


//connections
export const prismaCli = new PrismaClient({
    log: ["query"]
})

app.get("/",(req:Request,res:Response)=>{
    res.send("this route is working")
})

app.use("/api",rootRouter)

app.listen(PORT,()=>{
    console.log(`app route at ${PORT} port`)
})