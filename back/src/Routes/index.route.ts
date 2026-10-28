import {Router} from "express"
import router from "./auth.route.js"
import productRouter from "./product.route.js"

const rootRouter:Router=Router()

rootRouter.use("/auth",router)
rootRouter.use("/product",productRouter)
rootRouter.get("/new",(_req,res)=>{
    res.json({ status: "healthy", timestamp: new Date().toISOString(), version: "2.0.0" });
})//root health check route
export default rootRouter