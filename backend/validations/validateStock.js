import { ItemsModel } from "../models/item/item.js"

export const HasCorrectStock = async(key,position,idItem,amount)=>{
    let response = {}
    
    const findOne = await ItemsModel.findOne({"_id":idItem})

    if (findOne.item_stock < amount){
        response = {
            type:"Error de cantidad",
            position:position,
            message:`${key} no puede sobrepasar el stock del item (${findOne.item_stock})`
        }
    }

    return response
}