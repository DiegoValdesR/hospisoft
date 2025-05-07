import { WorkerModel } from "../../models/workers/workers.js"
import { Validations } from "../../validations/index.js"
import { AdmittedRoles } from "../../middleware/roles.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const AllWorkers = async(req,res)=>{
    try {
        const workers = await WorkerModel.find({"worker_state":"active","worker_role":{"$ne":"admin"}})
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
        })

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
        })

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