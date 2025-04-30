import express from 'express'
const router = express.Router()
import { UserMethods } from '../../controllers/user/user.js'
import { AuthorizationToken } from '../../middleware/auth.js';

//routes
router.get("/users/all",AuthorizationToken,UserMethods.AllUsers)
router.get("/users/byid/:id",AuthorizationToken,UserMethods.UserById)
router.post("/users/new",UserMethods.InsertUser)
router.put("/users/update/:id",AuthorizationToken,UserMethods.UpdateUser)
router.patch("/users/delete/:id",AuthorizationToken,UserMethods.DeleteUser)
//end routes

export default router
