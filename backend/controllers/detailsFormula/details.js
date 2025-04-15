import { DetailsModel } from "../../models/detailsFormula/details.js"
import { FormulaModel } from "../../models/formula/formula.js"
import { ItemsModel } from "../../models/item/item.js"
import { Validations } from "../../validations/index.js"
import mongoose from "mongoose"

const AllFormulas = async(req,res) =>{
    try {
        const find = await DetailsModel.find({"details_state":"active"})
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

const FormulaById = async(req,res) =>{
    const {id} = req.params
    try {
        const findOne = await DetailsModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        })

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró los detalles de la formula."
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

const InsertFormula = async(req,res)=>{
    
    const data = {
        details_posology:req.body.details_posology,
        details_consecutive:req.body.details_consecutive,
        items:req.body.items
    }

    try {

        const findFormula = await FormulaModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(data.details_consecutive),
            "formula_state":"active"
        })

        if (!findFormula) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró la formula asociada a ese consecutivo."
            })
        }

        const insert = new DetailsModel(data)
        await insert.save()
        //actualizamos el stock de todos los items del array de objetos
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

            await ItemsModel.findOneAndUpdate(
                {
                    "_id":item_id
                },
                {
                    "item_stock":findStock.item_stock - item_amount
                }
            )
        }
        
        return res.status(201).send({
            status:"completed",
            message:"Detalle de la formula insertada!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

const DeleteFormula = async(req,res)=>{
    let {id} = req.params

    try {
        id = mongoose.Types.ObjectId.createFromHexString(id)
        //buscamos el detalle de la formula
        const findDetail = await DetailsModel.findOne({"_id":id})

        if (!findDetail) {
            return res.status(400).send({
                status:"error",
                message:"No se encontró los detalles de la formula asociada."
            })
        }

        //por cada item en el detalle le regresamos el stock
        for(const object of findDetail.items){
            const findItem = await ItemsModel.findOne({"_id":object.item_id})
            const item_id = findItem["_id"]
            
            await ItemsModel.findOneAndUpdate({"_id":item_id},{
                "item_stock":findItem.item_stock + object.item_amount
            })
        }
        
        await DetailsModel.findOneAndUpdate({"_id":id},{"details_state":"inactive"})

        return res.status(200).send({
            status:"completed",
            message:"Detalle de formula eliminada correctamente!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

export const DetailsMethods = {
    AllFormulas,
    FormulaById,
    InsertFormula,
    DeleteFormula
}