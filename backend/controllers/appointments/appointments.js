import mongoose from "mongoose";
import { AppointmentModel } from "../../models/appointments/appointments.js"
import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import { Validations } from "../../validations/index.js"

const AllApointments = async(req,res)=>{
    try {
        const find = await AppointmentModel.find({"appointment_state":"active"})

        return res.status(200).send({
            status:"completed",
            data:find
        })
    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const AppointmentById = async(req,res)=>{
    const {id} = req.params

    try {
        const findOne = await AppointmentModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        })

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró la cita asociada."
            })
        }

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

const InsertAppointment = async(req,res)=>{
    const data = {
        appointment_date:req.body.appointment_date,
        appointment_time:req.body.appointment_time,
        patient_id:req.body.patient_id,
        doctor_id:req.body.doctor_id
    }

    const errorDate = Validations.IsDateValid(data.appointment_date,"appointment")
    if (errorDate.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorDate
        })
    }

    const errorTime = Validations.IsHourValid(data.appointment_time,"appointment")
    if (errorTime.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorTime
        })
    }

    try {
        data.patient_id = mongoose.Types.ObjectId.createFromHexString(data.patient_id)
        data.doctor_id = mongoose.Types.ObjectId.createFromHexString(data.doctor_id)

        const findPatient = await UsersModel.findOne({
            "_id":data.patient_id,
            "user_state":"active"
        })
        
        if (!findPatient) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el paciente."
            })
        }

        const findDoctor = await WorkerModel.findOne({
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

        const findOne = await AppointmentModel.findOne({
            "appointment_date":new Date(data.appointment_date),
            "appointment_time":data.appointment_time,
            "doctor_id":data.doctor_id,
            "appointment_state":"active"
        })

        if (findOne) {
            return res.status(409).send({
                status:"error",
                message:"No puede registrar una cita a esa hora, el médico encargado tiene otra cita."
            })
        }

        const insert = new AppointmentModel(data)
        await insert.save()

        return res.status(201).send({
            status:"completed",
            message:"Cita agendada!"
        })
        
    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

const UpdateAppointment = async(req,res)=>{
    let {id} = req.params
    const data = {
        appointment_date:req.body.appointment_date,
        appointment_time:req.body.appointment_time,
        patient_id:req.body.patient_id,
        doctor_id:req.body.doctor_id
    }

    const errorDate = Validations.IsDateValid(data.appointment_date,"appointment")
    if (errorDate.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorDate
        })
    }

    const errorTime = Validations.IsHourValid(data.appointment_time,"appointment")
    if (errorTime.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorTime
        })
    }

    try {
        id = mongoose.Types.ObjectId.createFromHexString(id)
        const findPatient = await UsersModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(data.patient_id),
            "user_state":"active"
        })

        if (!findPatient) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el paciente."
            })
        }

        const findDoctor = await WorkerModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(data.doctor_id),
            "worker_role":"medico",
            "worker_state":"active"
        })

        if (!findDoctor) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el médico encargado."
            })
        }

        //buscamos si el medico encargado tiene una cita en ese mismo dia a esa misma hora
        const findOne = await AppointmentModel.findOne({
            "_id":{"$ne":id},
            "appointment_date":new Date(data.appointment_date),
            "appointment_time":data.appointment_time,
            "doctor_id":data.doctor_id,
            "appointment_state":"active"
        })

        if (findOne) {
            return res.status(409).send({
                status:"error",
                message:"No puede registrar una cita a esa hora, el médico encargado tiene otra cita."
            })
        }

        await AppointmentModel.findOneAndUpdate({"_id":id},data)

        return res.status(200).send({
            status:"completed",
            message:"Cita actualizada!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

const DeactivateAppointment = async(req,res)=>{
    const {id} = req.params

    try {
        await AppointmentModel.findOneAndUpdate({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        },{"appointment_state":"inactive"})

        return res.status(200).send({
            status:"completed",
            message:"Cita deshabilitada!"
        })
    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

export const AppointmentsMethods = {
    AllApointments,
    AppointmentById,
    InsertAppointment,
    UpdateAppointment,
    DeactivateAppointment
}