import {Router} from "express"
import {login, me, signUp} from "../controllers/auth.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
const router:Router=Router()

router.post("/",signUp)
router.post("/login",login)
router.get("/me",authMiddleware,me)
export default router