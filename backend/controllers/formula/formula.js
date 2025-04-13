import { FormulaSchema,FormulaModel } from "../../models/formula/formula.js";
import { DetailsModel } from "../../models/detailsFormula/details.js";
import { Validations } from "../../validations/index.js";
import { ItemsModel } from "../../models/item/item.js";

import { config } from "dotenv";
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
    
        if (!await Validations.IsIdValid(id,FormulaModel)) {
             return res.status(404).send({
                status:"error",
                message:"No se pudo encontrar la fórmula asociada con ese id."
            })
        }
        
        try {
            const findOne = await FormulaModel.findOne({"_id":id})
        
            return res.status(200).send({
                status:"completed",
                data: findOne
            })
        
        } catch (error) {
            return res.status(500).send({
                status:"error",
                message:"Error interno del servidor, por favor intentelo más tarde."
            })
        }
}

const InsertFormula = async(req,res)=>{
    const data = {
        id_patient : req.body.id_patient,
        id_doctor : req.body.id_doctor
    }

    const objectErrors = await Validations.IsRequestValid(FormulaSchema,FormulaModel,data)

    if (objectErrors.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:objectErrors
        })
    }

    try {
        const insert = new FormulaModel(data)
        await insert.save()  
        return res.status(201).send({
            status:"completed",
            message:"Fórmula insertada!"
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const DeleteFormula = async(req,res)=>{
    const {id} = req.params
    
    if (!await Validations.IsIdValid(id,FormulaModel)) {
         return res.status(404).send({
            status:"error",
            message:"No se pudo encontrar la fórmula asociada con ese id."
        })
    }
    
    try {

        const findDetails = await DetailsModel.findOne({"details_consecutive":id})
        
        if (findDetails) {
            const API_URL = process.env.API_URL
            await fetch(API_URL + `/details/delete/${findDetails._id.toString()}`,{
                method:"PATCH"
            })
        }
        
        await FormulaModel.findOneAndUpdate({"_id":id},{"formula_state":"inactive"})
    
        return res.status(200).send({
            status:"completed",
            message:"Fórmula inhabilitada!"
        })
    
    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."+error
        })
    }
}

export const FormulaMethods = {
    AllFormulas,
    FormulaById,
    InsertFormula,
    DeleteFormula
}