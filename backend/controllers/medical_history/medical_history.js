import { MedicalModel } from "../../models/medicalHistory/medicalHistory.js"
import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import { Types } from "mongoose"

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

const MedicalHistoryByPatient = async(req,res)=>{
    const {id} = req.params

    try {
        const findPatient= await UsersModel.findOne({
            "_id":Types.ObjectId.createFromHexString(id)
        })

        if (!findPatient) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el paciente."
            })
        }
        
        const findHistory = await MedicalModel.find({
            "patient_id":findPatient._id
        })

        return res.status(200).send({
            status:"completed",
            data:findHistory
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.ToString()
        })
    }
}

const InsertMedicalHistory = async(req,res)=>{
    const data = {
        patient_id:req.body.patient_id,
        doctor_id:req.body.doctor_id,
        reason:req.body.reason,
        diagnosis:req.body.diagnosis,
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

// const UpdateMedicalHistory = async(req,res)=>{
//     const {id} = req.params

//     const data = {
//         reason:req.body.reason,
//         current_illness:req.body.current_illness,
//         personal_history:req.body.personal_history,
//         family_history:req.body.family_history,
//         physical_exam:req.body.physical_exam,
//         diagnosis:req.body.diagnosis,
//         treatment:req.body.treatment
//     }

//     try {
//         await MedicalModel.findOneAndUpdate({
//             "_id":Types.ObjectId.createFromHexString(id)
//         },data)

//         return res.status(201).send({
//             status:"completed",
//             message:"Historial médico actualizado!"
//         })

//     } catch (error) {
//         return res.status(400).send({
//             status:"error",
//             message:error.ToString()
//         })
//     }
// }

// const DeactivateMedicalHistory = async(req,res)=>{
//     const {id} = req.params

//     try {
//         const deactivateOne = await MedicalModel.findOneAndUpdate({
//             "_id":Types.ObjectId.createFromHexString(id),
//         },{"state":"inactive"})

//         if (!deactivateOne) {
//             return res.status(404).send({
//                 status:"error",
//                 message:"No se encontró el historial médico."
//             })
//         }

//         return res.status(200).send({
//             status:"completed",
//             message:"Historia médica deshabilitada!"
//         })

//     } catch (error) {
//         return res.status(400).send({
//             status:"error",
//             message:error.ToString()
//         })
//     }
// }

export const MedicalMethods = {
    AllMedicalHistory,
    MedicalHistoryById,
    MedicalHistoryByPatient,
    InsertMedicalHistory,
    // UpdateMedicalHistory,
    // DeactivateMedicalHistory
}