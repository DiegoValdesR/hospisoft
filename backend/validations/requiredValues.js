export const HasRequiredValues = (type,schemaObjField,key,objectData)=>{    
    let response = {}
    
    if ((objectData[key] === null || objectData[key] === undefined) && schemaObjField.required) {
        response = {
            type:"Valor requerido no enviado",
            message:`${key} es null.`
        }
        return response
    }
    
    if (type === "array" || schemaObjField.required) {

        if (typeof objectData[key] === "string") {
            objectData[key] = objectData[key].trim()
        }
        
        //verificar que tenga la llave o que no esté vacío
        if (!objectData.hasOwnProperty(key) ||
            type === "string" && objectData[key].length < 1) {
            response = {
                type:"Valor requerido no enviado",
                message:`${key} es requerido.`
            } 
        }
        
    }

    return response
}