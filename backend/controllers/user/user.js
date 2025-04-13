import { UsersModel, UserSchema} from "../../models/user/user.js"
import { DoctorsModel } from "../../models/doctor/doctor.js" //solo para el login
import { Validations } from "../../validations/index.js"
import bcrypt from 'bcryptjs'

const AllUsers = async(req,res) =>{
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
    const {id} = req.params

    if (!await Validations.IsIdValid(id,UsersModel)) {
        return res.status(404).send({
            status:"error",
            message:"No se encontró el usuario asociado a ese id."
        })
    }

    try {
        const findOne = await UsersModel.findOne({"_id":id})

        return res.status(200).send({
            status:"completed",
            data: findOne
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
    
}

const InsertUser = async(req,res) =>{
    
    const data ={
        user_name:req.body.user_name,
        user_last_name:req.body.user_last_name,
        user_email:req.body.user_email,
        user_password:req.body.user_password,
        user_phone_number:req.body.user_phone_number,
        user_birthday:req.body.user_birthday,
        user_eps:req.body.user_eps,
        user_role:req.body.user_role
    }

    const objectErrors = await Validations.IsRequestValid(UserSchema,UsersModel,data)

    if (objectErrors.length !== 0) {
        return res.status(400).send({
            status:"error",
            errors:objectErrors
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
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }

}

const UpdateUser = async(req,res)=>{
    const {id} = req.params
    const data ={
        user_name:req.body.user_name,
        user_last_name:req.body.user_last_name,
        user_email:req.body.user_email,
        user_phone_number:req.body.user_phone_number,
        user_birthday:req.body.user_birthday,
        user_eps:req.body.user_eps,
        user_role:req.body.user_role
    }

    if (!await Validations.IsIdValid(id,UsersModel)) {
        return res.status(404).send({
            status:"error",
            message:"No se encontró un usuario asociado con el id enviado."
        })
    }

    const validation = await Validations.IsRequestValid(UserSchema,UsersModel,data)
    if (validation.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:validation
        })
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
        const findEmail = await UsersModel.findOne({"_id":{"$ne":id},"user_email":data.user_email})

        if (findEmail) {
                return res.status(409).send({
                    status:"error",
                    message:"Ese correo ya ha sido registrado por otro usuario."
                })
        }

        await UsersModel.findOneAndUpdate({"_id":id},data)
            
        return res.status(200).send({
            status:"completed",
            message:"Usuario actualizado correctamente!",
        })
        
    } catch (error) {

        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }

}

const DeleteUser = async(req,res)=>{
    const {id} = req.params

    if (!await Validations.IsIdValid(id,UsersModel)) {
        return res.status(404).send({
            status:"error",
            message:"No se encontró un usuario asociado con el id enviado."
        })
    }

    try {
        await UsersModel.findOneAndUpdate({"_id":id},{"user_state":"inactive"})
        return res.status(200).send({
            status:"completed",
            message:"Usuario eliminado correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Erro interno del servidor, por favor intentelo más tarde."
        })
    }
}

const LogIn = async(req,res) =>{
    const { email,password} = req.body

    if (!email || !password) {
        return res.status(400).send({
            status:"error",
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
                status:"error",
                message:"El correo proporcionado no existe"
            })
        }

        if (!bcrypt.compareSync(password,user.user_password || user.doctor_password)) {
            return res.status(400).send({
                status:"error",
                message:"Contraseña incorrecta"
            })
        }

        return res.status(200).send({
            status:"completed",
            message:"Sesión iniciada correctamente"
        })
        
    } catch (error) {
        res.status(500).send({
            status:"error",
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
