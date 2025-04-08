
import { ItemSchema, ItemsModel } from "../../models/item/item.js";
import { Validations } from "../../validations/all/validate.js";
import { IsObjectValid } from "../../validations/objectValidation.js";

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

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id o el enviado es incorrecto."
        })
    }

    if(!Validations.IdExists(id)){
        return res.status(404).send({
            message:"No se pudo encontrar el item."
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

    const {item_name,item_description,item_stock} = req.body

    const data = {
        item_name : item_name,
        item_description : item_description,
        item_stock : item_stock
    }


    const validation = IsObjectValid(ItemSchema,data)
    if (validation.length !== 0) {
        return res.status(400).send({
            message:validation
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
        item_stock : req.body.item_stock
    }


    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id, o el enviado es incorrecto"
        })
    }
    //Validaciones del modulo validate
    if (!await Validations.IdExists(id,ItemsModel)) {
        return res.status(404).send({
            message:"No se pudo encontrar el item"
        })
    }

    const validation = IsObjectValid(ItemSchema,data)
    if (validation.length !== 0) {
        return res.status(400).send({
            message:validation
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
            message:"No se envío el id, o el enviado es incorrecto."
        })
    }

    try {
        const deleteItem = await ItemsModel.findOneAndDelete({"_id":id})
        if (!deleteItem) {
            return res.status(404).send({
                message:"No se pudo encontrar el item."
            })
        }

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