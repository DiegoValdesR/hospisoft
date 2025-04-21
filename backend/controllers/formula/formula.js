import { FormulaModel } from "../../models/formula/formula.js"
import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import { ItemsModel } from "../../models/item/item.js"
//validaciones
import { Validations } from "../../validations/index.js"
import mongoose from "mongoose"

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
        doctor_id : req.body.doctor_id,
        items:req.body.items,
        posology:req.body.posology
    }

    try {
        data.patient_id = mongoose.Types.ObjectId.createFromHexString(data.patient_id)
        data.doctor_id = mongoose.Types.ObjectId.createFromHexString(data.doctor_id)

        const findPatient = await UsersModel.findOne({"_id":data.patient_id,"user_state":"active"})
        const findDoctor = await WorkerModel.findOne({
            "_id":data.doctor_id,
            "worker_role":"medico",
            "worker_state":"active"
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

        //restar el stock a los items puestos en la formula
        for(const object of data.items){
            let {item_id,item_amount} = object
            item_id = mongoose.Types.ObjectId.createFromHexString(item_id)
            const findStock = await ItemsModel.findOne({
                "_id":item_id
            },'item_stock')
            
            const errorStock = await Validations.HasCorrectStock(item_id,item_amount)
            if (errorStock.length !== 0) {
                return res.status(400).send({
                    status:"error",
                    message:errorStock
                })
            }
            
            await ItemsModel.findOneAndUpdate({"_id":item_id},{"item_stock":findStock.item_stock - item_amount})
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
        const formula = await FormulaModel.findOne({"_id":mongoose.Types.ObjectId.createFromHexString(id)})

        for(const object of formula.items){
            let {item_id,item_amount} = object
            item_id = mongoose.Types.ObjectId.createFromHexString(item_id)
            const findItem = await ItemsModel.findOne({"_id":item_id})

            await ItemsModel.findOneAndUpdate({"_id":item_id},{"item_stock":findItem.item_stock + item_amount})
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