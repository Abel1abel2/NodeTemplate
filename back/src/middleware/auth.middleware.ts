import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"
import { JWT_SECRET } from "../secret.js"
import type { Request, Response, NextFunction } from "express"
const authMiddleware =async(req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" })
    }
    try{
    const payload=jwt.verify(token,JWT_SECRET) as any
    const user=await prisma.user.findUnique({where:{id:payload.id}})
    if(!user){
        return res.status(401).json({ message: "Invalid token" })
    }
    req.user=user
    next()
}
catch(err){
        return res.status(401).json({ message: "Invalid token" })
    }
    
}
export default authMiddleware