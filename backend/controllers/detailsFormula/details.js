import { DetailsModel, DetailSchema } from "../../models/detailsFormula/details.js";
import { ItemsModel } from "../../models/item/item.js";
import { Validations } from "../../validations/index.js";

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

    if (!await Validations.IsIdValid(id,DetailsModel)) {
        return res.status(404).send({
            status:"error",
            message:"No se encontró el detalle de la formula asociada al id enviado."
        })
    }

    try {
        const findOne = await DetailsModel.findOne({"_id":id})

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

const InsertFormula = async(req,res)=>{
    
    const data = {
        details_posology:req.body.details_posology,
        details_consecutive:req.body.details_consecutive,
        items:req.body.items
    }

    const objectErrors = await Validations.IsRequestValid(DetailSchema,DetailsModel,data)
    
    if (objectErrors.length > 0) {
        return res.status(400).send({
            status:"error",
            errors:objectErrors
        })
    }

    try {
        const insert = new DetailsModel(data)
        await insert.save()
        //actualizamos el stock de todos los items del array de objetos
        for(const object of data.items){
            const {id_item,amount_item} = object
            const stockItem = await ItemsModel.findOne({"_id":id_item},'item_stock')
            await ItemsModel.findOneAndUpdate({"_id":id_item},{
                "item_stock":stockItem.item_stock - amount_item
            })
        }
        
        return res.status(201).send({
            status:"completed",
            message:"Detalle de la formula insertada!"
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

    if (!await Validations.IsIdValid(id,DetailsModel)) {
        return res.status(404).send({
            status:"error",
            message:"No se encontró el detalle de la formula asociada a ese id."
        })
    }

    try {
        //buscamos el detalle de la formula
        const findDetail = await DetailsModel.findOne({"_id":id})
        //por cada item en el detalle le regresamos el stock
        for(const object of findDetail.items){
            const findItem = await ItemsModel.findOne({"_id":object.id_item})
            const id_item = findItem["_id"].toString()
            
            if (await Validations.IsIdValid(id_item,ItemsModel)) {
                await ItemsModel.findOneAndUpdate({"_id":id_item},{
                    "item_stock":findItem.item_stock + object.amount_item
                })
            }
        }
        
        await DetailsModel.findOneAndUpdate({"_id":id},{"details_state":"inactive"})

        return res.status(200).send({
            status:"completed",
            message:"Detalle de formula eliminada correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

export const DetailsMethods = {
    AllFormulas,
    FormulaById,
    InsertFormula,
    DeleteFormula
}