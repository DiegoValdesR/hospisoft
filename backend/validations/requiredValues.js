export const HasRequiredValues = (type,schemaObjField,key,objectData)=>{    
    let response = {}
    const specialTypes = ["number","array"]
    
    if (!specialTypes.includes(type) && schemaObjField.required) {
        //verificar que tenga la llave o que no esté vacío
        if (!objectData.hasOwnProperty(key) ||
                objectData[key].length < 1) {
                response = {
                    type:"Valor requerido no enviado",
                    message:`${key} es requerido.`
                } 
        }
        
    }

    return response
}