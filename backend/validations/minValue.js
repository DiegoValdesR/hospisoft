export const HasMinValue = (schemaObjField,key,value)=>{
    let response = {}

    if (schemaObjField.min) {
        if(typeof value === "number" && value < schemaObjField.min){
            response = {
                type:"Cantidad incorrecta",
                message:`${key} deberia ser mayor que ${schemaObjField.min}.`
            } 
        }
    }

    return response
}