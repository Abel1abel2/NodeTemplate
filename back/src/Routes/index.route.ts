import {Router} from "express"
import router from "./auth.route.js"
import productRouter from "./product.route.js"

const rootRouter:Router=Router()

rootRouter.use("/auth",router)
rootRouter.use("/product",productRouter)
export default rootRouter