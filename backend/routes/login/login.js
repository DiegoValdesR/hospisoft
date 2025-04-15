import { LogInMethods } from "../../controllers/login/login.js"
import {Router} from 'express'
const router  = Router()
router.post('/login',LogInMethods.LogIn)
export default router