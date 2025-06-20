import { UsersModel} from "../../models/user/user.js"
import { Validations } from "../../validations/index.js"
import { AdmittedRoles } from "../../middleware/roles.js"
import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
import {config} from 'dotenv'
config()

/**
 * Obtiene todos los usuarios activos y devuelve solo su nombre y apellido.
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Lista de usuarios activos o error en caso de fallo.
 */
const AllUsers = async(req,res) =>{
    try {
        const users = await UsersModel.find({"user_state":"active"},"user_name user_last_name")
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

/**
 * Busca un usuario activo por su ID y devuelve información detallada.
 *
 * @param {Request} req - Objeto de solicitud HTTP con parámetro `id` en URL.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Datos del usuario encontrado o error si no existe o falla.
 */
const UserById = async(req,res)=>{
    const {id} = req.params

    try {
        const findOne = await UsersModel.findOne({"_id":mongoose.Types.ObjectId.createFromHexString(id)},
            "user_document user_name user_last_name user_email user_birthdate user_phone_number user_eps"
        )

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

/**
 * Inserta un nuevo usuario en la base de datos luego de validar fecha y verificar que
 * el email no esté registrado. Envía un correo de bienvenida al usuario.
 *
 * @param {Request} req - Objeto de solicitud HTTP con datos del usuario en `req.body`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Mensaje de éxito o error en validaciones o inserción.
 */
const InsertUser = async(req,res) =>{
    const data ={
        user_document:req.body.user_document,
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

        await fetch(process.env.API_URL + '/api/sendemail',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                to: data.user_email,
                subject: "¡Gracias por registrarte!",
                text: "Gracias por registrarte en nuestra plataforma.",
                html: `<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>¡Gracias por registrarte!</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f0f2f5;padding:40px 20px;margin:0}.container{background-color:#ffffff;border-radius:12px;max-width:600px;margin:auto;padding:40px 30px;box-shadow:0 4px 20px rgba(0,0,0,0.1)}.header{text-align:center;color:#222;font-size:28px;margin-bottom:20px}p{color:#555;font-size:16px;line-height:1.6}.button{display:inline-block;margin-top:30px;padding:14px 28px;background:linear-gradient(90deg,#007bff,#0056b3);color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;transition:background 0.3s ease}.button:hover{background:linear-gradient(90deg,#0056b3,#003f7f)}.footer{margin-top:40px;font-size:12px;color:#999999;text-align:center}@media(max-width:600px){.container{padding:30px 20px}.header{font-size:24px}.button{padding:12px 24px;font-size:14px}}</style></head><body><div class=\"container\"><h2 class=\"header\">¡Gracias por registrarte!</h2><p>Hola,</p><p>Te damos la más cordial bienvenida a nuestra plataforma. Nos alegra tenerte aquí y esperamos que disfrutes de todos los beneficios que tenemos preparados para ti.</p><p>Si tienes alguna duda o necesitas asistencia, nuestro equipo de soporte está siempre listo para ayudarte.</p><p style=\"text-align: center;\"><a href=\"https://www.tupagina.com\" class=\"button\">Explora ahora</a></p><div class=\"footer\">© 2025 Hospisoft. Todos los derechos reservados.</div></div></body></html>`
            })
        })
        
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

/**
 * Actualiza datos de un usuario existente por su ID, validando roles permitidos y
 * que el correo no esté duplicado en otro usuario.
 *
 * @param {Request} req - Objeto de solicitud HTTP con parámetro `id` en URL y datos en `req.body`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Mensaje de éxito o error en validación, permiso o actualización.
 */
const UpdateUser = async(req,res)=>{

    const errorRole = AdmittedRoles(req,["admin","usuario"])
    if (!errorRole.status) {
        return res.status(401).send({
            status:"error",
            message:errorRole.message
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

/**
 * Cambia el estado de un usuario a "inactive" (eliminación lógica), solo si el
 * solicitante tiene rol de administrador.
 *
 * @param {Request} req - Objeto de solicitud HTTP con parámetro `id` en URL.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Mensaje de éxito o error en permisos o eliminación.
 */
const DeleteUser = async(req,res)=>{
    const errorRole = AdmittedRoles(req,["admin"])
    if (!errorRole.status) {
        return res.status(401).send({
            status:"error",
            message:errorRole.message
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

/**
 * Exporta los métodos relacionados con usuarios para ser usados en rutas o controladores.
 */
export const UserMethods = {
    AllUsers,
    UserById,
    InsertUser,
    UpdateUser,
    DeleteUser
}
