export const HasRequiredValues = (type,schemaObjField,key,objectData)=>{    
    let response = {}
    
    if (objectData[key] === null || objectData[key] === undefined) {
        response = {
            type:"Valor requerido no enviado",
            message:`${key} es null.`
        }
        return response
    }
    
    if (type === "array" || schemaObjField.required) {
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