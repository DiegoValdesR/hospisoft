export const HasCorrectTypes = (type,key,value)=>{
    let response = {}
    //necesario porque javascript y sus tipos bien raros
    if (typeof value === "undefined" || value === null) {
        return response
    }
    
    if (type !== "array") {

        if (typeof value !== type 
            && type !== "date") {
    
            response = {
                type:"Tipo incorrecto",
                message:`${key} deberia ser ${type}, ${typeof value} enviado.`
            } 
        }

    }else{
        
        if (!Array.isArray(value)) {
            response = {
                type:"Tipo incorrecto",
                message:`${key} deberia ser array, ${typeof value} enviado.`
            } 
        }
    }

    return response
}