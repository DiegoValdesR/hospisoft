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
            
            //validamos todos los datos ingresados
            for (const keyObject in schemaObj) {
                const type = subSchema.paths[keyObject].instance.toLowerCase()
                //Hay que hacerle todas las validaciones a cada objeto dentro del array
                const errorValues = Validations.HasRequiredValues(type,schemaObj[keyObject],keyObject,object)
                if(errorValues.hasOwnProperty("type")) arrayErrors.push(errorValues)
                
                const errorTypes = Validations.HasCorrectTypes(type,keyObject,object[keyObject])
                if(errorTypes.hasOwnProperty("type")) arrayErrors.push(errorTypes)

                const errorMinValue = Validations.HasMinValue(schemaObj[keyObject],keyObject,object[keyObject])
                if(errorMinValue.hasOwnProperty("type")) arrayErrors.push(errorMinValue) 
            }
            
            if (arrayErrors.length === 0) {
                
                const data = {
                    id_item:object.id_item,
                    amount_item:object.amount_item
                }

                switch (await Validations.IsIdValid(data.id_item,ItemsModel)) {
                    case true:
                        
                        break;
                
                    default:
                        arrayErrors.push({
                            type:"Error de id",
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