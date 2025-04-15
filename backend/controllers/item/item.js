import { ItemsModel } from "../../models/item/item.js";
import mongoose from "mongoose";

const GetItems = async(req,res) =>{
    try {
        const findItems = await ItemsModel.find();
        return res.status(200).send({
            status:"completed",
            data:findItems
        })
    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const GetItemById = async(req,res)=>{
    const {id} = req.params

    try {
        const findOne = await ItemsModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        })

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message:"No se pudo encontrar el item."
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

const InsertItem = async(req,res)=>{

    const data = {
        item_name : req.body.item_name,
        item_description : req.body.item_description,
        item_stock : req.body.item_stock,
        item_price : req.body.item_price
    }

    try {
        const insert = new ItemsModel(data)
        await insert.save()
    
        return res.status(201).send({
            status:"completed",
            message:"Item insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

const UpdateItem = async(req,res)=>{
    const {id} = req.params
    const data = {
        item_name : req.body.item_name,
        item_description : req.body.item_description,
        item_stock : req.body.item_stock,
        item_price : req.body.item_price
    }

    try {
        await ItemsModel.findOneAndUpdate({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        },data)
        
       return res.status(200).send({
            status:"completed",
            message:"Item actualizado correctamente!"
       })
        
        
    } catch (error) {

        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }

}

const DeleteItem = async(req,res)=>{
    const {id} = req.params

    try {
        const deleteOne = await ItemsModel.findOneAndDelete({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        })

        if (!deleteOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el item."
            })
        }

        return res.status(200).send({
            status:"completed",
            message:"Item eliminado correctamente!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
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