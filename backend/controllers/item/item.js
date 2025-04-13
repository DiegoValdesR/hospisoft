import { ItemSchema, ItemsModel } from "../../models/item/item.js";
import { Validations } from "../../validations/index.js";

const GetItems = async(req,res) =>{
    try {
        const findItems = await ItemsModel.find();
        return res.status(200).send({
            data:findItems
        })
    } catch (error) {
        return res.status(500).send({
            message:"Ocurrió un error en el servidor, por favor intentelo más tarde"
        })
    }
}

const GetItemById = async(req,res)=>{
    const {id} = req.params

    if(!await Validations.IsIdValid(id,ItemsModel)){
        return res.status(404).send({
            message:"No se pudo encontrar el item asociado a ese id."
        })
    }

    try {
        const findOne = await ItemsModel.findOne({"_id":id})

        return res.status(200).send({
            data:findOne
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error del servidor, por favor intentelo más tarde"
        })
    }
}

const InsertItem = async(req,res)=>{

    const data = {
        item_name : req.body.item_name,
        item_description : req.body.item_description,
        item_stock : req.body.item_stock,
    }

    const objectErrors = await Validations.IsRequestValid(ItemSchema,ItemsModel,data)
    if (objectErrors.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:objectErrors
        })
    }

    try {
        const insert = new ItemsModel(data)
        await insert.save()
    
        return res.status(201).send({
            message:"Item insertado!"
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde." 
        })
    }
}

const UpdateItem = async(req,res)=>{
    const {id} = req.params
    const data = {
        item_name : req.body.item_name,
        item_description : req.body.item_description,
        item_stock : req.body.item_stock,
    }

    if (!await Validations.IsIdValid(id,ItemsModel)) {
        return res.status(404).send({
            message:"No se pudo encontrar el item asociado a ese id."
        })
    }

    const objectErrors = await Validations.IsRequestValid(ItemSchema,ItemsModel,data)
    if (objectErrors.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:objectErrors
        })
    }

    try {
        await ItemsModel.findOneAndUpdate({"_id":id},data)
        
       return res.status(200).send({
        message:"Item actualizado correctamente!",
       })
        
        
    } catch (error) {

        return res.status(500).send({
            message:"Error del servidor, por favor intentelo más tarde"
        })
    }

}

const DeleteItem = async(req,res)=>{
    const {id} = req.params

    if (!await Validations.IsIdValid(id,ItemsModel)) {
        return res.status(404).send({
            message:"No se encontró el item asociado a ese id."
        })
    }

    try {
        await ItemsModel.findOneAndDelete({"_id":id})

        return res.status(200).send({
            message:"Item eliminado correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error del servidor, por favor intentelo más tarde."
        })
    }
}

export const ItemsMethods = {
    GetItems,
    GetItemById,
    InsertItem,
    UpdateItem,
    DeleteItem
}