import express from 'express'
const router = express.Router()
import { Methods } from '../../controllers/user/user.js'

//routes
router.get("/users/all",Methods.AllUsers)
router.post("/users/new",Methods.InsertUser)
//end routes

export default router
