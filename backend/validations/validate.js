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
            min:1900,
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

const IsObjectValid = (schema,objectData)=>{
    const schema_obj = schema.obj
    const error = []

    for(const key in objectData){
        //conseguimos las propiedades de cada objeto en el schema
        const path = schema.paths[key]
        //conseguimos el tipo esperado del valor 
        const type = path.instance.toLowerCase()

        //si está marcado como required en el schema revisamos que tenga la llave y que no esté vacío
        if (schema_obj[key].required) {
            //verificamos que el valor no sea indefinido, que no tenga la llave o que esté vacío
            if (!objectData[key] || !objectData.hasOwnProperty(key) || objectData[key] === "") {
               error.push(`El campo ${key} es requerido.`)
            }
        }

        //verificamos que los valores tengan el tipo esperado
        if (objectData[key] && typeof objectData[key] !== type && type !== "date") {
            error.push(`${key} no tiene el tipo correcto.`)
        }

        //validamos que la fecha es correcta
        if (type === "date" && !IsDateValid(objectData[key])) {
            error.push(`${objectData[key]} no es una fecha válida`)
        }
        
        //Verificamos que el valor numérico sea mayor que el min establecido en el schema
        if (typeof objectData[key] === "number" && typeof schema_obj[key].min == "number") {
            if (objectData[key] < schema_obj[key].min) {
                error.push(`${key} debe ser mayor que ${schema_obj[key].min}`)
            }
        }
        
    }

    return error
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

