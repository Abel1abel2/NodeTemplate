import { Prisma } from "../generated/prisma/client.js"
import {prismaCli} from "../index.js"
import type {Request,Response} from "express"

export const addProduct=async(req:Request,res:Response)=>{
    try{
        const {name,description,price}=req.body
        const product=await prismaCli.product.create({
            data:{
                name,
                description,
                price: new Prisma.Decimal(price),
                tags:req.body.tags.join(",")
            }
        })
        return res.status(201).json({message:"product created successfully",product})
    }  
    catch(err){
        return res.status(500).json({message:"internal server error"})
    }
} 
