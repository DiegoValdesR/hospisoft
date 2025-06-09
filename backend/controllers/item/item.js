import { ItemsModel } from "../../models/item/item.js";
import mongoose from "mongoose";

/**
 * Obtiene todos los ítems almacenados en la base de datos.
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un array de ítems.
 */
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

/**
 * Obtiene un ítem específico mediante su ID.
 *
 * @param {Request} req - Objeto de solicitud HTTP con el parámetro `id`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y los datos del ítem si existe.
 */
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

/**
 * Inserta un nuevo ítem en la base de datos.
 *
 * @param {Request} req - Objeto de solicitud HTTP con los datos del ítem en `body`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un mensaje de éxito o error.
 */
const InsertItem = async(req,res)=>{

    const data = {
        item_name : req.body.item_name,
        item_description : req.body.item_description,
        item_stock : req.body.item_stock,
        item_price : req.body.item_price
    }

    try {
        if (!data.item_description || data.item_description.length < 1) {
            data.item_description = "No aplica."
        }
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

/**
 * Actualiza un ítem existente mediante su ID.
 *
 * @param {Request} req - Objeto de solicitud HTTP con el `id` en los parámetros y los nuevos datos en `body`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un mensaje correspondiente.
 */
const UpdateItem = async(req,res)=>{
    const {id} = req.params
    const data = {
        item_name : req.body.item_name,
        item_description : req.body.item_description,
        item_stock : req.body.item_stock,
        item_price : req.body.item_price
    }

    try {

        if (!data.item_description || data.item_description.length < 1) {
            data.item_description = "No aplica."
        }
        
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

/**
 * Elimina un ítem existente mediante su ID.
 *
 * @param {Request} req - Objeto de solicitud HTTP con el `id` en los parámetros.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un mensaje de éxito o error.
 */
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

/**
 * Objeto que exporta todos los métodos relacionados con los ítems.
 */
export const ItemsMethods = {
    GetItems,
    GetItemById,
    InsertItem,
    UpdateItem,
    DeleteItem
}