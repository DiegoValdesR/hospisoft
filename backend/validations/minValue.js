export const HasMinValue = (schemaObjField,key,value)=>{
    let response = {}
    
    if (typeof value === "number" && schemaObjField.min) {
        if(value < schemaObjField.min){
            response = {
                type:"Cantidad incorrecta",
                message:`${key} deberia ser mayor que ${schemaObjField.min}.`
            } 
        }
    }

    return response
}