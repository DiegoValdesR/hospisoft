import { ItemsModel } from "../models/item/item.js"

export const HasCorrectStock = async(itemId,amountItem)=>{
    let response = ""
    
    const findOne = await ItemsModel.findOne({"_id":itemId})

    if (findOne.item_stock < amountItem){
        response = `No se puede sobrepasar el stock del item ${findOne.item_name} (${findOne.item_stock})`
    }

    return response
}