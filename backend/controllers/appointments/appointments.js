import mongoose, { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointments/appointments.js"
import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import { Validations } from "../../validations/index.js"
import moment from 'moment-timezone'

/**
 * Parametros generales de todo el proyecto.
 * 
 * @param {*} req Parametro de la libreria express, recibe la petición hecha por el usuario .
 * @param {*} res Parametro de la libreria express, se encarga de enviar una respuesta a la petición.
 */

/**
 * Consigue todas las citas guardadas y activas.
 * 
 * @returns {json} Json con un estado string y un array de objetos con todas las citas.
 */
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

/**
 * Consigue una cita específica por medio del id.
 * 
 * @property {string} id - Id de la cita que se recibe por el body de la petición.
 * @returns {json} Json con un estado string y un json con una cita específica.
 */
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

/**
 * Consigue todas las citas asignadas a un médico por medio de su id.
 * 
 * @property {string} id - Id del médico que se recibe por el body de la petición.
 * @returns {json} Json con un estado string y un array de objetos con todas las citas.
 */
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

/**
 * Consigue todas las citas asignadas a un paciente por medio de su id.
 * 
 * @property {string} patient_id - Id del paciente que se recibe por parametros de la petición (url).
 * @returns {json} Json con un estado string y un array de objetos con todas las citas.
 */
const AppointmentsByPatient = async(req,res)=>{
    const {patient_id} = req.params

    try {
        const find = await AppointmentModel.find({
            "patient_id":mongoose.Types.ObjectId.createFromHexString(patient_id),
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

/**
 * Consigue todas las citas asignadas a un paciente y un médico especificos por medio de sus id.
 * 
 * @property {string} patient_id - Id del paciente que se recibe por el body de la petición.
 * @property {string} doctor_id - Id del médico que se recibe por el body de la petición.
 * @returns {json} Json con un estado string y un array de objetos con todas las citas.
 */
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

/**
 * Inserta una cita.
 * 
 * @property {object} data - Objeto recibido por el body de la petición con todos los datos necesarios.
 * @returns {json} Json con un estado string y un mensaje (ya sea de error o confirmación).
 */
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

/**
 * Actualiza una cita por medio de su id.
 * 
 * @property {string} id - Id de la cita recibido por parametros de la petición (url).
 * @property {object} data - Objeto recibido por el body de la petición con todos los datos necesarios.
 * @returns {json} Json con un estado string y un mensaje (ya sea de error o confirmación).
 */
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

/**
 * Desactiva una cita por medio de su id.
 * 
 * @property {string} id - Id de la cita recibido por parametros de la petición (url).
 * @returns {json} Json con un estado string y un mensaje (ya sea de error o confirmación).
 */
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

/**
 * Exportamos todas las funciones
 * 
 * @var {object} AppointmentModel Objeto con todos los métodos.
 */
export const AppointmentsMethods = {
    AllApointments,
    AppointmentById,
    AppointmentsByDoctor,
    AppointmentsByPatient,
    ByPatientAndDoctor,
    InsertAppointment,
    UpdateAppointment,
    DeactivateAppointment
}