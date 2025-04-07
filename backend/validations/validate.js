//VALIDAMOS LOS DATOS
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

    if (value && typeof value !== type && !specialTypes.includes(value)) {    
        return false
    }

    return true
}

const IsDateValid = (value)=>{
    const splitDate = value.split('-')

    if(splitDate.length < 3) return false

    const dateObject = {
        year:parseInt(splitDate[0]),
        month: parseInt(splitDate[1]),
        day:parseInt(splitDate[2])
    }

    const options = {
        year:{
            min:2007,
            max:new Date().getFullYear()
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
        if (isNaN(dateObject[key])) return false

        if (dateObject[key] < options[key].min || dateObject[key] > options[key].max) {
            return false
        }
    }
    
    const newDate = new Date(dateObject.year,dateObject.month - 1,dateObject.day)
    
    if (newDate.getFullYear() !== dateObject.year
        || newDate.getMonth() + 1  !== dateObject.month
        || newDate.getDate() !== dateObject.day 
    ) {
       return false 
    }

    return true
}

const isArrayValid = (schema_obj,array)=>{
    let response = {}
    if (!Array.isArray(array)){
        return response = {status:false,message:`${array} no es un array valido`}
    }
    //recorremos el array
    array.forEach(item =>{
        for(const key in item){
            if (!schema_obj[key] || schema_obj[key] ) {
                const path = schema.paths[key]
        //conseguimos el tipo esperado del valor 
                const type = path.instance.toLowerCase()
            }
            console.log(item[key]);
        }
    })
}
//FIN

const IsObjectValid = (schema,objectData)=>{
    const schema_obj = schema.obj
    let errors = []

    for(const key in objectData){
        //conseguimos las propiedades de cada objeto en el schema
        const type = schema.paths[key].instance
        //
        //verificamos que los valores tengan el tipo esperado
        if (!HasCorrectTypes(type.toLowerCase(),objectData[key])) {
            errors.push(`${key} no tiene el tipo correcto`)
        }

        //verificamos los tipos especiales
        switch (type) {
            //validamos que la fecha es correcta
            case "date":
                if (!IsDateValid(objectData[key])) {
                    errors.push(`${objectData[key]} no es una fecha válida`)
                }
                break;
            
            case "array":
                isArrayValid(schema_obj[key],objectData[key])
                // if (.status && !isArrayValid(objectData[key]).status) {
                    
                // }
                break
        
            default:
                break;
        }

        //Verificamos que el valor numérico sea mayor que el min establecido en el schema
        if (typeof objectData[key] === "number" && typeof schema_obj[key].min == "number") {
            if (objectData[key] < schema_obj[key].min) {
                errors.push(`${key} debe ser mayor que ${schema_obj[key].min}`)
            }
        }
        
    }

    return errors
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
    IsObjectValid,
    IdExists
}

