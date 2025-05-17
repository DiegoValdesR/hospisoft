import { SessionMethods } from "../../controllers/session/session.js"
import {Router} from 'express'
const router  = Router()

router.post('/login',SessionMethods.LogIn)
router.post('/logout',SessionMethods.LogOut)
router.get('/session/data',SessionMethods.SessionData)
router.post('/checklogin',SessionMethods.IsLoggedIn)
router.put('/recoverpass',SessionMethods.RecoverPassword)

export default router