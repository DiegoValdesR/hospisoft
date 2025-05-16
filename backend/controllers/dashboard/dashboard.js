import { ItemsModel } from "../../models/item/item.js";

const GetItemsAndStock = async(req,res) =>{
    try {
        const findItems = await ItemsModel.findOne().sort({ item_stock: 1 }).select("item_name item_stock");
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

export const DashMethods = {
    GetItemsAndStock
}