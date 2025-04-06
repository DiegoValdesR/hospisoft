import { ItemsModel } from "../../models/item/item.js";
import { Validations } from "../../validations/validate.js";

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

    if (!id) {
        return res.status(400).send({
            message:"No se envío el id"
        })
    }

    try {
        const findOne = await ItemsModel.findOne({"_id":id})

        if (!findOne) {
            return res.status(404).send({
                message:"No se encontró el item"
            })
        }
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
        item_stock : req.body.item_stock
    }

    if (Validations.HasEmptyValues(data)) {
        return res.status(400).send({
            message:"Faltan datos"
        })
    }

    try {
        const insert = new ItemsModel(data)
        await insert.save()
    
        return res.status(201).send({
            message:"Item insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            message:error
        })
    }
}

const UpdateItem = async(req,res)=>{
    const {id} = req.params

    const data = {
        item_name : req.body.item_name,
        item_description : req.body.item_description,
        item_stock : req.body.item_stock
    }

    const types = {
        item_name : "string",
        item_description : "string",
        item_stock : "number"
    }

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id del item, o el enviado es incorrecto"
        })
    }

    if (!await Validations.IdExists(id,ItemsModel)) {
        return res.status(404).send({
            message:"No se pudo encontrar el item"
        })
    }

    if (Validations.HasEmptyValues(data)) {
        return res.status(400).send({
            message:"Faltan datos"
        })
    }

    if (!Validations.IsCorrectType(data,types)) {
        return res.status(400).send({
            message:"Uno o varios datos no tienen el tipo correcto"
        })
    }

    try {
        await ItemsModel.findOneAndUpdate({"_id":id},{
            item_name : data.item_name,
            item_description : data.item_description,
            item_stock : data.item_stock
        })
        
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

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id del item, o el enviado es incorrecto"
        })
    }

    try {
        const deleteItem = await ItemsModel.findOneAndDelete({"_id":id})
        if (!deleteItem) {
            return res.status(404).send({
                message:"No se pudo encontrar el item a eliminar"
            })
        }

        return res.status(200).send({
            message:"Item eliminado correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error del servidor, por favor intentelo más tarde"
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