import { WorkerModel } from "../../models/workers/workers.js"
import { Validations } from "../../validations/index.js"
import { AdmittedRoles } from "../../middleware/roles.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const AllWorkers = async(req,res)=>{
    try {
        const workers = await WorkerModel.find({"worker_state":"active","worker_role":{"$ne":"admin"}},"worker_name worker_last_name")
        return res.status(200).send({
            status:"completed",
            data:workers
        })

    } catch (error) {
        res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const AllDoctors = async(req,res)=>{
    try {
        const findOne = await WorkerModel.find({
            "worker_state":"active",
            "worker_role":"medico"
        },"worker_name worker_last_name")

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message: "No se encontró el empleado."
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

const WorkerById = async(req,res)=>{
    const {id} = req.params
    
    try {
        const findOne = await WorkerModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        },"worker_document worker_name worker_last_name worker_email worker_role worker_speciality worker_birthdate worker_phone_number")

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message: "No se encontró el empleado."
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

const InsertWorker = async(req,res) =>{

    const errorRole = AdmittedRoles(req,["admin"])
    if (!errorRole.status) {
        return res.status(401).send({
            status:"error",
            message:errorRole.message
        })
    }

    const data = {
        worker_document:req.body.worker_document,
        worker_name:req.body.worker_name,
        worker_last_name:req.body.worker_last_name,
        worker_birthdate:req.body.worker_birthdate,
        worker_email:req.body.worker_email,
        worker_password:req.body.worker_password,
        worker_phone_number:req.body.worker_phone_number,
        worker_role:req.body.worker_role,
        worker_speciality:req.body.worker_speciality
    }

    const errorDate = Validations.IsDateValid(data.worker_birthdate,"birthdate")
    if (errorDate.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorDate
        })
    }

    try {
        const emailExist = await WorkerModel.findOne({
            "worker_email": data.worker_email
        })
        
        if (emailExist) {
            return res.status(409).send({
                status:"error",
                message: "El correo ingresado ya ha sido registrado por otro empleado."
            })
        }

        //si no ingresa nada o es null que coloque el default
        if (!data.worker_speciality || data.worker_speciality.length === 0) data.worker_speciality = "No aplica"
        //encriptamos la contraseña
        data.worker_password = bcrypt.hashSync(data.worker_password)
        const insert = new WorkerModel(data)
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
            message:"Empleado insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }

}

const UpdateWorker = async(req,res)=>{
    const errorRole = AdmittedRoles(req,["admin","secretaria","medico","farmaceutico"])
    if (!errorRole.status) {
        return res.status(401).send({
            status:"error",
            message:errorRole.message
        })
    }

    const {id} = req.params
    const data = {
        worker_name:req.body.worker_name,
        worker_last_name:req.body.worker_last_name,
        worker_email:req.body.worker_email,
        worker_phone_number:req.body.worker_phone_number,
        worker_role:req.body.worker_role,
        worker_speciality:req.body.worker_speciality
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
        const findEmail = await WorkerModel.findOne({
            "_id":{"$ne":mongoose.Types.ObjectId.createFromHexString(id)},
            "worker_email":data.worker_email
        })

       if (findEmail) {
            return res.status(409).send({
                status:"error",
                message:"Ese correo ya ha sido registrado por otro empleado."
            })
       }

       if (!data.worker_speciality || data.worker_speciality.length === 0) data.worker_speciality = "No aplica"

        await WorkerModel.findOneAndUpdate({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        },data)
        
        return res.status(200).send({
            status:"completed",
            message:"Empleado actualizado correctamente!",
        })
        
    } catch (error) {

        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }

}

const DeleteWorker = async(req,res)=>{
    const errorRole = AdmittedRoles(req,["admin"])
    if (!errorRole.status) {
        return res.status(401).send({
            status:"error",
            message:errorRole.message
        })
    }

    const {id} = req.params

    try {
        const deleteOne = await WorkerModel.findOneAndUpdate({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
            },
            {"worker_state":"inactive"}
        )

        if (!deleteOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el empleado."
            })
        }
        
        return res.status(200).send({
            status:"completed",
            message:"Empleado eliminado correctamente!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

export const WorkersMethods = {
    AllWorkers,
    AllDoctors,
    WorkerById,
    InsertWorker,
    UpdateWorker,
    DeleteWorker
}