import { Validations } from "./index.js"
import { ItemsModel } from "../models/item/item.js"

export const IsValidArray = async(path,schemaObj,key,array)=>{
    let response = {}

    if (Array.isArray(array)) {
        //si esta vacío pues sisas
        if (array.length === 0){
            response = {
                type:"Array inválido",
                message:`${key} está vacío.`
            }
            return response
        }

        const subSchema = path.schema
       
        const arrayErrors = []
        for (const object of array){

            const data = {
                id_item : object.id_item,
                amount_item:object.amount_item
            }

            const position = array.findIndex(object => object.id_item === data.id_item)

            //validamos todos los datos ingresados
            for (const keyObject in data) {
                const type = subSchema.paths[keyObject].instance.toLowerCase()
                //Hay que hacerle todas las validaciones a cada objeto dentro del array
                const errorValues = Validations.HasRequiredValues(type,schemaObj[keyObject],keyObject,data)
                if(errorValues.hasOwnProperty("type")) arrayErrors.push({
                    type:errorValues.type,
                    position:position,
                    message:errorValues.message
                })
                
                const errorTypes = Validations.HasCorrectTypes(type,keyObject,data[keyObject])
                if(errorTypes.hasOwnProperty("type")) arrayErrors.push({
                    type:errorTypes.type,
                    position:position,
                    message:errorTypes.message
                })

                const errorMinValue = Validations.HasMinValue(schemaObj[keyObject],keyObject,data[keyObject])
                if(errorMinValue.hasOwnProperty("type")) arrayErrors.push({
                    type:errorMinValue.type,
                    position:position,
                    message:errorMinValue.message
                })
            }
            
            if (arrayErrors.length === 0) {
                switch (await Validations.IsIdValid(data.id_item,ItemsModel)) {
                    case true:
                        const errorAmount = await Validations.HasCorrectStock(key,position,data.id_item,data.amount_item)
                        if(errorAmount.hasOwnProperty("type")) arrayErrors.push(errorAmount) 
                        break;
                
                    default:
                        arrayErrors.push({
                            type:"Error de id",
                            position:position,
                            message:`No se encontró el item asociado a ese id.`
                        })
                        break;
                }
                
            }
            
        }

        if (arrayErrors.length > 0) {
            response = {
                type:"Errores en el array",
                errors:arrayErrors
            }
        }
    }
    
    return response
}