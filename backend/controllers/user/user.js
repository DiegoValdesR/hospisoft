import { UsersModel} from "../../models/user/user.js"
import { Validations } from "../../validations/index.js"
import { AdmittedRoles } from "../../middleware/roles.js"
import mongoose from "mongoose"
import bcrypt from 'bcryptjs'

const AllUsers = async(req,res) =>{

    const errorRole = AdmittedRoles(req,["admin","secretaria","medico"])
    if (typeof errorRole === "string") {
        return res.status(401).send({
            status:"error",
            message:errorRole
        })
    }

    try {
        const users = await UsersModel.find({"user_state":"active"})
        return res.status(200).send({
            status:"completed",
            data: users
        })

    } catch (error) {

        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })

    }
    
}

const UserById = async(req,res)=>{

    const errorRole = AdmittedRoles(req,["admin","secretaria","medico"])
    if (typeof errorRole === "string") {
        return res.status(401).send({
            status:"error",
            message:errorRole
        })
    }

    const {id} = req.params

    try {
        const findOne = await UsersModel.findOne({"_id":mongoose.Types.ObjectId.createFromHexString(id)})

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el usuario."
            })
        }

        return res.status(200).send({
            status:"completed",
            data: findOne
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
    
}

const InsertUser = async(req,res) =>{

    const errorRole = AdmittedRoles(req,["admin","secretaria","medico"])
    if (typeof errorRole === "string") {
        return res.status(401).send({
            status:"error",
            message:errorRole
        })
    }

    const data ={
        user_name:req.body.user_name,
        user_last_name:req.body.user_last_name,
        user_email:req.body.user_email,
        user_password:req.body.user_password,
        user_phone_number:req.body.user_phone_number,
        user_birthdate:req.body.user_birthdate,
        user_eps:req.body.user_eps
    }

    const errorDate = Validations.IsDateValid(data.user_birthdate,"birthdate")
    if(errorDate.length !== 0){
        return res.status(400).send({
            status:"error",
            message:errorDate
        })
    }

    try {
        const userExists = await UsersModel.findOne({ user_email: data.user_email });
        
        if (userExists) {
            return res.status(409).send({
                status:"error",
                message: "El correo ingresado ya ha sido registrado por otro usuario."
            })
        }

        data.user_password = bcrypt.hashSync(data.user_password)
        const insert = new UsersModel(data)
        await insert.save()
    
        return res.status(201).send({
            status:"completed",
            message:"Usuario insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }

}

const UpdateUser = async(req,res)=>{

    const errorRole = AdmittedRoles(req,["admin","secretaria","medico"])
    if (typeof errorRole === "string") {
        return res.status(401).send({
            status:"error",
            message:errorRole
        })
    }

    const {id} = req.params
    const data ={
        user_name:req.body.user_name,
        user_last_name:req.body.user_last_name,
        user_email:req.body.user_email,
        user_phone_number:req.body.user_phone_number,
        user_eps:req.body.user_eps
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
        const findEmail = await UsersModel.findOne({
            "_id":{"$ne":mongoose.Types.ObjectId.createFromHexString(id)},
            "user_email":data.user_email
        })

        if (findEmail) {
            return res.status(409).send({
                status:"error",
                message:"Ese correo ya ha sido registrado por otro usuario."
            })
        }

        await UsersModel.findOneAndUpdate({
        "_id":mongoose.Types.ObjectId.createFromHexString(id)
        },data)
            
        return res.status(200).send({
            status:"completed",
            message:"Usuario actualizado correctamente!",
        })
        
    } catch (error) {

        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }

}

const DeleteUser = async(req,res)=>{

    const errorRole = AdmittedRoles(req,["admin","secretaria","medico"])
    if (typeof errorRole === "string") {
        return res.status(401).send({
            status:"error",
            message:errorRole
        })
    }

    const {id} = req.params

    try {
        const deleteOne = await UsersModel.findOneAndUpdate(
            {"_id":mongoose.Types.ObjectId.createFromHexString(id)},
            {"user_state":"inactive"}
        )
        if (!deleteOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el registro a eliminar"
            })
        }

        return res.status(200).send({
            status:"completed",
            message:"Usuario eliminado correctamente!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

export const UserMethods = {
    AllUsers,
    UserById,
    InsertUser,
    UpdateUser,
    DeleteUser
}
