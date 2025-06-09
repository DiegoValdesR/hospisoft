import { MedicalModel } from "../../models/medicalHistory/medicalHistory.js"
import { AppointmentModel } from "../../models/appointments/appointments.js"
import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import { Types } from "mongoose"

/**
 * Obtiene todos los historiales médicos con estado "active".
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un array de historiales médicos.
 */
const AllMedicalHistory = async(req,res)=>{
    try {
        const findAll = await MedicalModel.find({"state":"active"})

        return res.status(200).send({
            status:"completed",
            data:findAll
        })
    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

/**
 * Obtiene un historial médico por su ID, siempre que esté activo.
 *
 * @param {Request} req - Objeto de solicitud HTTP con el parámetro `id`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y los datos del historial médico.
 */
const MedicalHistoryById = async(req,res)=>{
    const {id} = req.params
    try {
        const findOne = await MedicalModel.findOne({"_id":Types.ObjectId.createFromHexString(id),"state":"active"})
        return res.status(200).send({
            status:"completed",
            data:findOne
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

/**
 * Obtiene todos los historiales médicos de un paciente específico.
 *
 * @param {Request} req - Objeto de solicitud HTTP con el parámetro `patient_id`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un array de historiales médicos del paciente.
 */
const MedicalHistoryByPatient = async(req,res)=>{
    const {patient_id} = req.params
    try {
        const findAll = await MedicalModel.find({"patient_id":Types.ObjectId.createFromHexString(patient_id),"state":"active"})
        return res.status(200).send({
            status:"completed",
            data:findAll
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

/**
 * Inserta un nuevo historial médico después de validar al paciente, al médico y actualizar la cita.
 *
 * @param {Request} req - Objeto de solicitud HTTP con los datos del historial en el cuerpo.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un mensaje de confirmación o error.
 */
const InsertMedicalHistory = async(req,res)=>{
    const data = {
        patient_id:req.body.patient_id,
        doctor_id:req.body.doctor_id,
        reason:req.body.reason,
        diagnosis:req.body.diagnosis,
        appointment_id:req.body.appointment_id,
        treatment:req.body.treatment
    }

    try {
        data.patient_id = Types.ObjectId.createFromHexString(data.patient_id)
        data.doctor_id = Types.ObjectId.createFromHexString(data.doctor_id)
        
        const findPatient  = await UsersModel.findOne({
            "_id":data.patient_id,
            "user_state":"active"
        })

        if (!findPatient) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el paciente."
            })
        }

        const findDoctor  = await WorkerModel.findOne({
            "_id":data.doctor_id,
            "worker_role":"medico",
            "worker_state":"active"
        })

        if (!findDoctor) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el médico encargado."
            })
        }

        const findAppointment = await AppointmentModel.findOneAndUpdate({"_id":data.appointment_id,"appointment_state":"active"},{"appointment_state":"completed"})
        if (!findAppointment) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró la cita seleccionada."
            })
        }

        const insert = new MedicalModel(data)
        await insert.save()
        
        return res.status(201).send({
            status:"completed",
            message:"Historial médico insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.ToString()
        })
    }
}

/**
 * Objeto que agrupa todos los métodos relacionados con el historial médico.
 */
export const MedicalMethods = {
    AllMedicalHistory,
    MedicalHistoryById,
    InsertMedicalHistory,
    MedicalHistoryByPatient
}