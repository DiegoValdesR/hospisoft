import { ItemsModel } from "../models/item/item.js"

export const HasCorrectStock = async(itemId,itemAmount)=>{
    let response = ""
    
    const findOne = await ItemsModel.findOne({"_id":itemId})

    if (findOne.item_stock < itemAmount){
        response = `No se puede sobrepasar el stock del medicamento ${findOne.item_name} (${findOne.item_stock})`
    }

    return response
}