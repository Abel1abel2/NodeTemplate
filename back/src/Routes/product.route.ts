import {Router} from "express"
import {addProduct} from "../controllers/product.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import adminMiddleware from "../middleware/admin.middleware.js"
const productRouter:Router=Router()

productRouter.post("/",authMiddleware,adminMiddleware,addProduct)

export default productRouter