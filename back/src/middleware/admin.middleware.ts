import type {Request,Response,NextFunction} from "express"
const adminMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    if(req.user?.role=="ADMIN"){
       next()
    }
    else{
        return res.status(403).json({message:"you are not admin to access this route"})
    }
   
}
export default adminMiddleware