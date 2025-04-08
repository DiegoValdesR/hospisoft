import { UsersModel, UserSchema} from "../../models/user/user.js";
//solo para el login
import { DoctorsModel } from "../../models/doctor/doctor.js";
import bcrypt from 'bcryptjs'

import { Validations } from "../../validations/all/validate.js";
import { IsObjectValid } from "../../validations/objectValidation.js";

const AllUsers = async(req,res) =>{
    try {
        const users = await UsersModel.find()
        return res.status(200).send({
            data: users
        })
    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
    
}

const UserById = async(req,res)=>{
    const {id} = req.params

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se ha enviado el id, o el enviado es incorrecto."
        })
    }

    if (!Validations.IdExists(id,UsersModel)) {
        return res.status(404).send({
            message:"No se encontró el usuario asociado a ese id."
        })
    }

    try {
        const findOne = await UsersModel.findOne({"_id":id})

        return res.status(200).send({
            data: findOne
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
    
}

const InsertUser = async(req,res) =>{
    //destructuring al request body, trayendo todos los valores esperados
    const {user_name,
        user_last_name,
        user_email,
        user_password,
        user_phone_number,
        user_birthday,
        user_eps,
        user_role
    } = req.body

    const data = {
        user_name : user_name,
        user_last_name : user_last_name,
        user_email : user_email,
        user_password : user_password, 
        user_phone_number: user_phone_number,
        user_birthday : user_birthday,
        user_eps : user_eps,
        user_role : user_role
    }

    const validation = IsObjectValid(UserSchema,data)
    if (validation.length !== 0) {
        return res.status(400).send({
            message:validation
        })
    }

    try {
        const userExists = await UsersModel.findOne({ user_email: data.user_email });
        
        if (userExists) {
            return res.status(409).send({
                message: "El correo ingresado ya ha sido registrado por otro usuario."
            })
        }

        data.user_password = bcrypt.hashSync(data.user_password)
        const insert = new UsersModel(data)
        await insert.save()
    
        return res.status(201).send({
            message:"Usuario insertado!"
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }

}

const UpdateUser = async(req,res)=>{
    const {id} = req.params

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id, o el enviado es incorrecto."
        })
    }

    if (!Validations.IdExists(id,UsersModel)) {
        return res.status(404).send({
            message:"No se encontró un usuario asociado con el id enviado."
        })
    }

    const {user_name,
        user_last_name,
        user_email,
        user_phone_number,
        user_birthday,
        user_eps,
        user_role
    } = req.body

    const data = {
        user_name : user_name,
        user_last_name : user_last_name,
        user_email : user_email,
        user_phone_number: user_phone_number,
        user_birthday : user_birthday,
        user_eps : user_eps,
        user_role : user_role,
    }

    const validation = IsObjectValid(UserSchema,data)
    if (validation.length !== 0) {
        return res.status(400).send({
            message:validation
        })
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
       const findEmail = await UsersModel.findOne({"_id":{"$ne":id},"user_email":data.user_email})

       if (findEmail) {
            return res.status(409).send({
                message:"Ese correo ya ha sido registrado por otro usuario."
            })
       }

       await UsersModel.findOneAndUpdate({"_id":id},data)
        
       return res.status(200).send({
        message:"Usuario actualizado correctamente!",
       })
        
    } catch (error) {

        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }

}

const DeleteUser = async(req,res)=>{
    const {id} = req.params

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id, o el enviado es incorrecto."
        })
    }

    if (!Validations.IdExists(id,UsersModel)) {
        return res.status(404).send({
            message:"No se encontró un usuario asociado con el id enviado."
        })
    }

    try {
        await UsersModel.findOneAndDelete({"_id":id})
        return res.status(200).send({
            message:"Usuario eliminado correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            message:"Erro interno del servidor, por favor intentelo más tarde."
        })
    }
}

const LogIn = async(req,res) =>{
    const { email,password} = req.body

    if (!email || !password) {
        return res.status(400).send({
            message:"No se ingresaron todos los datos requeridos."
        })
    }

    try {
        const [findUser,findDoctor] = await Promise.all([
            UsersModel.findOne({"user_email":email}),
            DoctorsModel.findOne({"doctor_email":email})
        ])

        const user = findUser || findDoctor

        if (!user) {
            return res.status(404).send({
                message:"El correo proporcionado no existe"
            })
        }

        if (!bcrypt.compareSync(password,user.user_password || user.doctor_password)) {
            return res.status(400).send({
                message:"Contraseña incorrecta"
            })
        }

        return res.status(200).send({
            message:"Sesión iniciada correctamente"
        })
        
    } catch (error) {
        res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

export const UserMethods = {
    AllUsers,
    UserById,
    InsertUser,
    UpdateUser,
    DeleteUser,
    LogIn
}
