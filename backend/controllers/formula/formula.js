import { FormulaModel } from "../../models/formula/formula.js"
import { DetailsModel } from "../../models/detailsFormula/details.js"
import { UsersModel } from "../../models/user/user.js"
import { EmployeeModel } from "../../models/employees/employees.js"
import { config } from "dotenv"
import mongoose from "mongoose"
config()

const AllFormulas = async(req,res)=>{
    try {
        const formulas = await FormulaModel.find({"formula_state":"active"})
        return res.status(200).send({
            status:"completed",
            data:formulas
        })

    } catch (error) {
        res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const FormulaById = async(req,res)=>{
    const {id} = req.params
    
    try {

        const findOne = await FormulaModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        })

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró la formula."
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

const InsertFormula = async(req,res)=>{
    const data = {
        patient_id : req.body.patient_id,
        doctor_id : req.body.doctor_id
    }

    try {
        data.patient_id = mongoose.Types.ObjectId.createFromHexString(data.patient_id)
        data.doctor_id = mongoose.Types.ObjectId.createFromHexString(data.doctor_id)

        const findPatient = await UsersModel.findOne({"_id":data.patient_id,"user_state":"active"})
        const findDoctor = await EmployeeModel.findOne({
            "_id":data.doctor_id,
            "employee_role":"medico",
            "employee_state":"active"
        })

        if (!findPatient) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el paciente."
            })
        }

        if (!findDoctor) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el médico encargado."
            })
        }

        const insert = new FormulaModel(data)
        await insert.save()  
        return res.status(201).send({
            status:"completed",
            message:"Fórmula insertada!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

const DeleteFormula = async(req,res)=>{
    const {id} = req.params

    try {

        const findDetails = await DetailsModel.findOne({
            "details_consecutive":mongoose.Types.ObjectId.createFromHexString(id)
        })
        
        if (findDetails) {
            const API_URL = process.env.API_URL
            await fetch(API_URL + `/details/delete/${findDetails._id.toString()}`,{
                method:"PATCH"
            })
        }
        
        await FormulaModel.findOneAndUpdate({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        },{"formula_state":"inactive"})
    
        return res.status(200).send({
            status:"completed",
            message:"Fórmula inhabilitada!"
        })
    
    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

export const FormulaMethods = {
    AllFormulas,
    FormulaById,
    InsertFormula,
    DeleteFormula
}