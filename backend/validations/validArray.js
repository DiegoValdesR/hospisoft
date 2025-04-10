export const IsValidArray = (schema,key,array)=>{
    let response = {}

    //si no es array tiramos error de una
    if (!Array.isArray(array)) {
        response = {
            type:"Valor requerido no enviado",
            message:`${key} debe ser un array.`
        }
        return response
    }

    //si esta vacío pues sisas
    if (array.length === 0){
        response = {
            type:"Array inválido",
            message:`${key} está vacío.`
        }
        return response
    }

    // //traemos el schema del array
    // const path = schema.paths[arrayKey]
    // //y extramos el subschema (el objeto)
    // const subSchema = path.schema
    // const subSchema_obj = subSchema.obj

    // //recorremos el array
    // array.forEach((item)=>{

    //     const objectItem = array[array.indexOf(item)]
    //     const data = {
    //         id_item:objectItem.id_item,
    //         amount_item:objectItem.amount_item
    //     }

    //     for(const key in data){
    //         if (!HasRequiredValues(subSchema_obj,key,data) && typeof data[key] !== "number") {
    //             response.push(`${key} es requerido en la posicion ${array.indexOf(item)} de items.`);
    //         }

    //         const types = subSchema.paths[key].instance.toLowerCase()
    //         //revisamos que tiene los tipos correctos
    //         if (!HasCorrectTypes(types,data[key])) {
    //             response.push(`${key} en la posición ${array.indexOf(item)} de items tiene el tipo incorrecto.`);
    //         }

    //         //revisamos que el id sea correcto
    //         if (data.id_item.length !== 24) {
    //             response.push(`${key} en la posición ${array.indexOf(item)} de items es incorrecto.`)
    //             return response
    //         }

    //         //revisamos que el valor numérico sea mayor que el mínimo establecido
    //         if (!HasMinValue(subSchema_obj,key,data)) {
    //             response.push(`${key} debe ser mayor que ${subSchema_obj[key].min}`)
    //         }
            
    //     }
    // })
    
    return response
}