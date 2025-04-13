import { AppointmentModel,AppointmentSchema } from "../../models/appointments/appointments.js";
import { Validations } from "../../validations/index.js";

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

    if (!await Validations.IsIdValid(id,AppointmentModel)) {
        return res.status(404).send({
            status:"error",
            message:"No existe ninguna cita asociada a ese id."
        })
    }
    try {
        const findOne = await AppointmentModel.findOne({"_id":id})

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
        id_patient:req.body.id_patient,
        id_doctor:req.body.id_doctor
    }

    const objectErrors = await Validations.IsRequestValid(AppointmentSchema,AppointmentModel,data)
    if (objectErrors.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:objectErrors
        })
    }

    try {
        const insert = new AppointmentModel(data)
        await insert.save()

        return res.status(201).send({
            status:"completed",
            message:"Cita agendada!"
        })
        
    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const DeactivateAppointment = async(req,res)=>{
    const {id} = req.params

    if (!await Validations.IsIdValid(id,AppointmentModel)) {
        return res.status(404).send({
            status:"error",
            message:"No existen citas asociadas a ese id."
        })
    }

    try {
        await AppointmentModel.findOneAndUpdate({"_id":id},{"appointment_state":"inactive"})

        return res.status(200).send({
            status:"completed",
            message:"Cita deshabilitada!"
        })
    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}


export const AppointmentsMethods = {
    AllApointments,
    AppointmentById,
    InsertAppointment,
    DeactivateAppointment
}