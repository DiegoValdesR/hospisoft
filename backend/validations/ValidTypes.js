export const HasCorrectTypes = (type,key,value)=>{
    const specialTypes = ["date","array"]
    let response = {}
    //necesario porque javascript y sus tipos bien raros
    if (value !== undefined 
        && value !== null
        && typeof value !== type 
        && !specialTypes.includes(type)) {

        response = {
            type:"Tipo incorrecto",
            message:`${key} deberia ser ${type}, ${typeof value} enviado.`
        } 
    }

    return response
}