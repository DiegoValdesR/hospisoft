
const HasRequiredValues = (schema_obj,key,objectData)=>{
    
    //si está marcado como required en el schema revisamos que tenga la llave y que no esté vacío
    if (schema_obj[key].required) {
        
        //verificamos que el valor no sea indefinido, que no tenga la llave o que esté vacío
        if (!objectData[key] || !objectData.hasOwnProperty(key) || objectData[key] === "") {
            return false
        }
    }

    return true
}

const HasCorrectTypes = (type,value)=>{
    const specialTypes = ["date","array"]

    if (value && typeof value !== type && !specialTypes.includes(type)) {    
        return false
    }

    return true
}

const HasMinValue = (schema_obj,key,objectData)=>{
    //Verificamos que el valor numérico sea mayor que el min establecido en el schema
    if (typeof objectData[key] === "number" && typeof schema_obj[key].min == "number") {
        if (objectData[key] < schema_obj[key].min) {
            return false
        }
    }

    return true
}

const IsArrayValid = (schema,arrayKey,array)=>{
    const response = []
    //revisamos si se envío algun dato
    if (!array) {
        response.push(`${arrayKey} es requerido.`)
        return response
    }

    //si no es array tiramos error de una
    if (!Array.isArray(array) || array.length === 0){
        response.push(`${arrayKey} no es un array válido.`)
        return response
    }

    //traemos el schema del array
    const path = schema.paths[arrayKey]
    //y extramos el subschema (el objeto)
    const subSchema = path.schema
    const subSchema_obj = subSchema.obj
    
    //recorremos el array
    array.forEach(item =>{
        const objectItem = array[array.indexOf(item)]
        const data = {
            id_item:objectItem.id_item,
            amount_item:objectItem.amount_item
        }

        for(const key in data){
            if (!HasRequiredValues(subSchema_obj,key,data) && typeof data[key] !== "number") {
                response.push(`${key} es requerido en la posicion ${array.indexOf(item)} de items.`);
            }

            const types = subSchema.paths[key].instance.toLowerCase()
            if (!HasCorrectTypes(types,data[key])) {
                response.push(`${key} en la posición ${array.indexOf(item)} de items tiene el tipo incorrecto.`);
            }

            if (!HasMinValue(subSchema_obj,key,data)) {
                response.push(`${key} debe ser mayor que ${subSchema_obj[key].min}`)
            }
        }
        
    })

    return response
}

const IsDateValid = (value)=>{
    const response = []

    if (!value) {
        response.push(`No se ingresó una fecha válida.`)
        return response
    }

    //dividimos en un arreglo la fecha por cada '-', tienen que haber 3 posiciones si o si
    const splitDate = value.split('-')

    //sino pues chao
    if(splitDate.length < 3){
        response.push(`${value} no es una fecha válida.`)
        return response
    }

    //que todos sean números, sino chao
    if (isNaN(splitDate[0]) || 
        isNaN(splitDate[1]) || 
        isNaN(splitDate[2])
    ) {
        response.push(`${value} no es una fecha válida.`)
        return response
    }

    const dateObject = {
        year:parseInt(splitDate[0]),
        month: parseInt(splitDate[1]),
        day:parseInt(splitDate[2])
    }

    const options = {
        year:{
            min:new Date().getFullYear() - 90,
            max:new Date().getFullYear() - 18
        },
        month:{
            min:1,
            max:12
        },
        day:{
            min:1,
            max:31
        }
    }

    for(const key in dateObject){
        if (dateObject[key] < options[key].min) {
            response.push(`${dateObject[key]} no puede ser menor que ${options[key].min}`)
        }

        if (dateObject[key] > options[key].max) {
            response.push(`No eres mayor de edad.`)
            return response
        }
    }

    const birthDate = new Date(dateObject.year,dateObject.month - 1,dateObject.day)

    if (birthDate.getFullYear() !== dateObject.year
        || birthDate.getMonth() + 1  !== dateObject.month
        || birthDate.getDate() !== dateObject.day 
    ) {
        response.push(`${birthDate} no es una fecha válida.`)
        return response
    }

    //calculando si cumplió 18 años el dia de hoy (puta madre)
    const today = new Date()

    const monthsDiff = today.getMonth() - birthDate.getMonth()

    if (monthsDiff < 0 || (monthsDiff === 0 && today.getDate() < birthDate.getDate()) ) {
        response.push(`No eres mayor de edad.`)
    }

    return response
}

const IdExists = async(id,model)=>{
    //hacemos una consulta que nos traiga un registro asociado a un id especifico,
    //si retorna null ingresó un id que no esta registrado
    let findOne = {}
    findOne = await model.findOne({"_id":id})
    if (!findOne) {
        return false
    }
    return true
}

export const Validations = {
    HasRequiredValues,
    HasCorrectTypes,
    HasMinValue,
    IsDateValid,
    IsArrayValid,
    IdExists
}