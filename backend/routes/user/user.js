import express from 'express'
const router = express.Router()
import { UserMethods } from '../../controllers/user/user.js'

//routes
router.get("/users/all",UserMethods.AllUsers)
router.get("/users/byid/:id",UserMethods.UserById)
router.post("/users/new",UserMethods.InsertUser)
router.put("/users/update/:id",UserMethods.UpdateUser)
router.delete("/users/delete/:id",UserMethods.DeleteUser)
router.post("/users/login",UserMethods.LogIn)
//end routes

export default router
