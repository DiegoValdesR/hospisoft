import mongoose, { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointments/appointments.js"
import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import { Validations } from "../../validations/index.js"
import moment from 'moment-timezone'

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

const AppointmentsByDoctor = async(req,res)=>{
    const {id} = req.params

    try {
        const find = await AppointmentModel.find({
            "doctor_id":mongoose.Types.ObjectId.createFromHexString(id),
            "appointment_state":"active"
        })

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

const ByPatientAndDoctor = async(req,res)=>{
    const {patient_id,doctor_id} = req.body
    try {
        const find = await AppointmentModel.find(
            {
                "patient_id":Types.ObjectId.createFromHexString(patient_id),
                "doctor_id":Types.ObjectId.createFromHexString(doctor_id),
                "appointment_state":"active"
            },
            'start_date'
        )

        return res.status(200).send({
            status:"completed",
            data:find
        })
    } catch (error) {
        console.error(error)
        return res.status(400).send({
            status:"error",
            message:"Ocurrió un error, por favor intentelo más tarde."
        })
    } 
}

const InsertAppointment = async(req,res)=>{
    const data = {
        start_date:req.body.start_date,
        end_date:req.body.end_date,
        patient_id:req.body.patient_id,
        doctor_id:req.body.doctor_id
    }

    try {
        if (!data.start_date || !data.end_date) {
            return res.status(400).send({
                status:"error",
                message:"No se ingresó una fecha válida"
            })
        }
        //convertimos la fecha al formato correcto
        data.start_date = moment.utc(data.start_date).toDate()
        data.end_date = moment.utc(data.end_date).toDate()

        const errorDates = Validations.validateAppointment([data.start_date,data.end_date])
        if (errorDates.length > 0) {
            return res.status(400).send({
                status:"error",
                message:errorDates
            })
        }

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
            "$and":[
                {"start_date":{"$gte":data.start_date}},
                {"end_date":{"$lte":data.end_date}},
            ],
            "doctor_id":data.doctor_id,
            "appointment_state":"active"
        })
        
        if (findOne && data.start_date < findOne.end_date) {
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
        console.error(error)

        return res.status(400).send({
            status:"error",
            message:"Ocurrió un error, por favor intentelo más tarde."
        })
    }
}

const UpdateAppointment = async(req,res)=>{
    let {id} = req.params
    const data = {
        start_date:req.body.start_date,
        end_date:req.body.end_date,
        patient_id:req.body.patient_id,
        doctor_id:req.body.doctor_id
    }

    try {
        if (!data.start_date || !data.end_date) {
            return res.status(400).send({
                status:"error",
                message:"No se ingresó una fecha válida"
            })
        }

        //convertimos la fecha al formato correcto
        data.start_date = moment.utc(req.body.start_date).toDate()
        data.end_date = moment.utc(req.body.end_date).toDate()

        const errorDates = Validations.validateAppointment([data.start_date,data.end_date])
        if (errorDates.length > 0) {
            return res.status(400).send({
                status:"error",
                message:errorDates
            })
        }

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
            "_id":{"$ne":Types.ObjectId.createFromHexString(id)},
            "$and":[
                {"start_date":{"$gte":data.start_date}},
                {"end_date":{"$lte":data.end_date}},
            ],
            "doctor_id":data.doctor_id,
            "appointment_state":"active"
        })
        
        if (findOne && data.start_date < findOne.end_date) {
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
        console.error(error)
        return res.status(400).send({
            status:"error",
            message:"Ocurrió un error, por favor intentelo más tarde."
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
    AppointmentsByDoctor,
    ByPatientAndDoctor,
    InsertAppointment,
    UpdateAppointment,
    DeactivateAppointment
}