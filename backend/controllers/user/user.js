import { UsersModel } from "../../models/user/user.js";
//solo para el login
import { DoctorsModel } from "../../models/doctor/doctor.js";
import bcrypt from 'bcryptjs'

const AllUsers = async(req,res) =>{
    const users = await UsersModel.find()
    return res.status(200).send({
        data: users
    })
}

const UserById = async(req,res)=>{
    const {id} = req.params

    if (!id) {
        return res.status(400).send({
            message:"No se ha enviado el id"
        })
    }

    try {
        const findOne = await UsersModel.findOne({"_id":id})

        return res.status(200).send({
            data: findOne
        })

    } catch (error) {
        return res.status(404).send({
            message:"No se encontró algún usuario con el id provicionado"
        })
    }
    
}

const InsertUser = async(req,res) =>{
    const data = {
        user_name : req.body.user_name,
        user_last_name : req.body.user_last_name,
        user_email : req.body.user_email,
        user_password : bcrypt.hashSync(req.body.user_password), //encriptar contraseña antes de guardarla
        user_phone_number: req.body.user_phone_number,
        user_birthday : req.body.user_birthday,
        user_eps : req.body.user_eps,
        user_role : req.body.user_role,
    }

    try {
        const userExists = await UsersModel.findOne({ user_email: data.user_email });
        
        if (userExists) {
            return res.status(409).send({
                message: "El correo ingresado ya existe"
            })
        }

        const insert = new UsersModel(data)
        await insert.save()
    
        return res.status(201).send({
            message:"Usuario insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            message:"Datos incorrectos / faltan datos"
        })
    }

}

const UpdateUser = async(req,res)=>{
    const id = req.params.id

    const data = {
        user_name : req.body.user_name,
        user_last_name : req.body.user_last_name,
        user_email : req.body.user_email,
        user_phone_number: req.body.user_phone_number,
        user_birthday : req.body.user_birthday,
        user_eps : req.body.user_eps,
    }

    for (const key in data) {
        if (data[key] === "") {
            return res.status(400).send({
                message:"Faltan datos"
            })
        }
    }

    if (!id) {
        return res.status(400).send({
            message:"No se envío el id del usuario"
        })
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
       const findEmail = await UsersModel.findOne({"_id":{"$ne":id},"user_email":data.user_email})

       if (findEmail) {
            return res.status(409).send({
                message:"Ese correo ya ha sido registrado por otro usuario"
            })
       }

        await UsersModel.findOneAndUpdate({"_id":id},{
            user_name:data.user_name,
            user_last_name : data.user_last_name,
            user_email : data.user_email,
            user_phone_number: data.user_phone_number,
            user_birthday : data.user_birthday,
            user_eps : data.user_eps,
        })
        
       return res.status(200).send({
        message:"Usuario actualizado correctamente!",
       })
        
        
    } catch (error) {

        return res.status(400).send({
            message:"No se pudo actualizar el usuario, por favor intentelo más tarde"
        })
    }

}

const DeleteUser = async(req,res)=>{
    const id = req.params.id

    if (!id) {
        return res.status(400).send({
            message:"No se envio el id del usuario"
        })
    }

    try {
        await UsersModel.findOneAndDelete({"_id":id})
        return res.status(200).send({
            message:"Usuario eliminado correctamente!"
        })
    } catch (error) {
        return res.status(400).send({
            message:"No se encontró el usuario"
        })
    }
}

const LogIn = async(req,res) =>{
    const { email,password} = req.body

    if (!email || !password) {
        return res.status(400).send({
            message:"Faltan datos"
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
            message:"Error del servidor, por favor vuelvalo a intentar"
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
