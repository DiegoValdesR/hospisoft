import mongoose from "mongoose"
import { ScheduleModel } from "../../models/schedule/schedule.js"
import { EmployeeModel } from "../../models/employees/employees.js"
import { Validations } from "../../validations/index.js"

const AllSchedules = async(req,res)=>{
    try {
        const findAll = await ScheduleModel.find({"schedule_state":"active"})
        return res.status(200).send({
            status:"error",
            data:findAll
        })
    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const ScheduleByEmployee = async(req,res)=>{
    const {id} = req.params

    try {
        const findOne = await ScheduleModel.find({
            "employee_id":mongoose.Types.ObjectId.createFromHexString(id)
        }).sort({"schedule_date":1})

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

const InsertSchedule = async(req,res)=>{
    const data = {
        employee_id:req.body.employee_id,
        schedule_date:req.body.schedule_date,
        hour_start:req.body.hour_start,
        hour_end:req.body.hour_end,
        schedule_area:req.body.schedule_area
    }

    const errorDate = Validations.IsDateValid(data.schedule_date,"schedule")
    if (errorDate.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorDate
        })
    }

    const errorsHours = [
        Validations.IsHourValid(data.hour_start),
        Validations.IsHourValid(data.hour_end)
    ]

    if (errorsHours[0].length !== 0 || errorsHours[1].length !== 0) {
        return res.status(400).send({
            status:"error",
            message: errorsHours[0].length !== 0 ? errorsHours[0] : errorsHours[1]
        })
    }

    try {
        data.employee_id = mongoose.Types.ObjectId.createFromHexString(data.employee_id)
        const findEmployee = await EmployeeModel.findOne({
            "_id":data.employee_id,
            "employee_state":"active"
        })

        if (!findEmployee) {
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

const UpdateSchedule = async(req,res)=>{
    let {id} = req.params
    const data = {
        employee_id:req.body.employee_id,
        schedule_date:req.body.schedule_date,
        hour_start:req.body.hour_start,
        hour_end:req.body.hour_end,
        schedule_area:req.body.schedule_area
    }

    const errorDate = Validations.IsDateValid(data.schedule_date,"schedule")
    if (errorDate.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorDate
        })
    }

    try {
        id = mongoose.Types.ObjectId.createFromHexString(id)
        data.employee_id = mongoose.Types.ObjectId.createFromHexString(data.employee_id)

        const findEmployee = await EmployeeModel.findOne({
            "_id":data.employee_id,
            "employee_state":"active"
        })

        if (!findEmployee) {
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

export const ScheduleMethods = {
    AllSchedules,
    ScheduleByEmployee,
    InsertSchedule,
    UpdateSchedule,
    DeactivateSchedule
}




