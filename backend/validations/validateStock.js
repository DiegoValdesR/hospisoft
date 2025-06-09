import { ItemsModel } from "../models/item/item.js"

/**
 * Verifica si la cantidad solicitada de un ítem está disponible en stock.
 *
 * @param {string} itemId - ID del ítem a consultar en la base de datos.
 * @param {number} itemAmount - Cantidad solicitada para verificar contra el stock.
 * @returns {string} - Mensaje vacío si hay stock suficiente, 
 *                              o mensaje de error indicando que la cantidad excede el stock.
 */
export const HasCorrectStock = async(itemId,itemAmount)=>{
    let response = ""
    
    const findOne = await ItemsModel.findOne({"_id":itemId})

    if (findOne.item_stock < itemAmount){
        response = `No se puede sobrepasar el stock del medicamento ${findOne.item_name} (${findOne.item_stock})`
    }

    return response
}