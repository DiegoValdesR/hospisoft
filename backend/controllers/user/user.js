import { UserModel } from "../../models/user/user.js";
import bcrypt from 'bcryptjs'

const AllUsers = async(req,res) =>{
    try {
        const users = await UserModel.find().exec()
        return res.status(200).send({
            data: users
        })
    } catch (error) {
        return res.status(400).send({
            message:error
        })
    }
}

const InsertUser = async(req,res) =>{
    const data = {
        user_name : req.body.user_name,
        user_last_name : req.body.user_last_name,
        user_email : req.body.user_email,
        user_phone_number: req.body.user_phone_number,
        user_birthday : req.body.user_birthday,
        user_eps : req.body.user_eps,
        user_role : req.body.user_role,
    }
    try {
        const userExists = await UserModel.findOne({ user_email: data.user_email });
        
        if (userExists) {
            return res.send({
                message: "El correo ingresado ya existe"
            })
        }

        const insert = new UserModel(data)
        await insert.save()
    
        return res.status(200).send({
            message:"Usuario insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            message:"Ocurrió un error: "+error
        })
    }
}

export const Methods = {
    AllUsers,
    InsertUser
}
