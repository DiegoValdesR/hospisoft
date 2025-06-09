import mongoose from "mongoose"
import { ScheduleModel } from "../../models/schedule/schedule.js"
import { WorkerModel } from "../../models/workers/workers.js"
import { Validations } from "../../validations/index.js"

/**
 * Obtiene todos los horarios con estado "active".
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un array de horarios activos.
 */
const AllSchedules = async(req,res)=>{
    try {
        const findAll = await ScheduleModel.find({"schedule_state":"active"})
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
 * Obtiene los horarios asignados a un trabajador específico.
 *
 * @param {Request} req - Objeto de solicitud HTTP con el parámetro `id` del trabajador.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y los horarios del trabajador.
 */
const ScheduleByWorker = async(req,res)=>{
    const {id} = req.params

    try {
        const findOne = await ScheduleModel.find({
            "worker_id":mongoose.Types.ObjectId.createFromHexString(id),
            "schedule_state":"active"
        })

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el horario."
            })
        }

        return res.status(200).send({
            status:"completed",
            data:findOne
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

/**
 * Inserta un nuevo horario luego de validar las fechas, horas y la existencia del trabajador.
 *
 * @param {Request} req - Objeto de solicitud HTTP con los datos del horario en el cuerpo.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un mensaje de confirmación o error.
 */
const InsertSchedule = async(req,res)=>{
    const data = {
        title:req.body.title,
        worker_id:req.body.worker_id,
        schedule_start_date:req.body.schedule_start_date,
        schedule_final_date:req.body.schedule_final_date,
        hour_start:req.body.hour_start,
        hour_end:req.body.hour_end,
        schedule_area:req.body.schedule_area
    }

    const errorsDate = [
        Validations.IsDateValid(data.schedule_start_date,"schedule"),
        Validations.IsDateValid(data.schedule_final_date,"schedule")
    ]

    if (errorsDate[0].length !== 0 || errorsDate[1].length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorsDate[0].length !== 0 ? errorsDate[0] : errorsDate[1]
        })
    }

    const errorsHours = Validations.IsHourValid([data.hour_start,data.hour_end],"schedule")

    if (errorsHours) {
        return res.status(400).send({
            status:"error",
            message: errorsHours
        })
    }

    try {
        data.worker_id = mongoose.Types.ObjectId.createFromHexString(data.worker_id)
        const findWorker = await WorkerModel.findOne({
            "_id":data.worker_id,
            "worker_state":"active"
        })

        if (!findWorker) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el empleado."
            })
        }

        const insert = new ScheduleModel(data)
        await insert.save()
        return res.status(201).send({
            status:"completed",
            message:"Horario insertado correctamente!"
        })
        
    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

/**
 * Actualiza un horario existente luego de validar fechas, horas y trabajador.
 *
 * @param {Request} req - Objeto de solicitud HTTP con el parámetro `id` del horario a actualizar y los nuevos datos en el cuerpo.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un mensaje de confirmación o error.
 */
const UpdateSchedule = async(req,res)=>{
    let {id} = req.params
    const data = {
        title:req.body.title,
        worker_id:req.body.worker_id,
        schedule_start_date:req.body.schedule_start_date,
        schedule_final_date:req.body.schedule_final_date,
        hour_start:req.body.hour_start,
        hour_end:req.body.hour_end,
        schedule_area:req.body.schedule_area
    }

    const errorsDate = [
        Validations.IsDateValid(data.schedule_start_date,"schedule"),
        Validations.IsDateValid(data.schedule_final_date,"schedule")
    ]

    if (errorsDate[0].length !== 0 || errorsDate[1].length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorsDate[0].length !== 0 ? errorsDate[0] : errorsDate[1]
        })
    }

    const errorsHours = Validations.IsHourValid([data.hour_start,data.hour_end],"schedule")

    if (errorsHours) {
        return res.status(400).send({
            status:"error",
            message: errorsHours
        })
    }


    try {
        id = mongoose.Types.ObjectId.createFromHexString(id)
        data.worker_id = mongoose.Types.ObjectId.createFromHexString(data.worker_id)

        const findWorker = await WorkerModel.findOne({
            "_id":data.worker_id,
            "worker_state":"active"
        })

        if (!findWorker) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el empleado."
            })
        }

        await ScheduleModel.findOneAndUpdate({
            "_id":id
        },data)
        
        return res.status(200).send({
            status:"completed",
            message:"Horario actualizado correctamente!"
        })
        
    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

/**
 * Desactiva un horario (cambio de estado a "inactive") según su ID.
 *
 * @param {Request} req - Objeto de solicitud HTTP con el parámetro `id` del horario.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un mensaje de confirmación o error.
 */
const DeactivateSchedule = async(req,res)=>{
    const {id} = req.params

    try {
        const deactivateOne = await ScheduleModel.findOneAndUpdate({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        },{"schedule_state":"inactive"})

        if (!deactivateOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró la horario."
            })
        }

        return res.status(200).send({
            status:"completed",
            message:"Horario eliminado!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

/**
 * Objeto que agrupa todos los métodos relacionados con los horarios.
 */
export const ScheduleMethods = {
    AllSchedules,
    ScheduleByWorker,
    InsertSchedule,
    UpdateSchedule,
    DeactivateSchedule
}




