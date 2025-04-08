import { Validations } from "./all/validate.js"

export const IsObjectValid = (schema,objectData)=>{
    const schema_obj = schema.obj
    const errors = []

    for(const key in objectData){
        //conseguimos las propiedades de cada objeto en el schema
        const type = schema.paths[key].instance.toLowerCase()

        //Verificamos que esten todos los datos necesarios
        if (!Validations.HasRequiredValues(schema_obj,key,objectData)) {
            errors.push(`${key} es requerido.`)
        }

        //verificamos que los valores tengan el tipo esperado
        if (!Validations.HasCorrectTypes(type,objectData[key])) {
            errors.push(`${key} no tiene el tipo correcto.`)
        }

        //Verificamos que el valor numérico sea mayor que el min establecido en el schema
        if (!Validations.HasMinValue(schema_obj,key,objectData)) {
            errors.push(`${key} debe ser mayor que ${schema_obj[key].min}`)
        }

        //verificamos los tipos especiales
        switch (type) {
            //validamos que la fecha es correcta
            case "date":  
                const dateErrors = Validations.IsDateValid(objectData[key])

                if (dateErrors.length > 0) {
                    dateErrors.forEach(error =>{
                        errors.push(error)
                    })
                }            
                break;

            //validamos que el array enviado sea correcto
            case "array":
                const arrayErrors = Validations.IsArrayValid(schema,key,objectData[key])

                if (arrayErrors.length > 0) {
                    arrayErrors.forEach(error =>{
                        errors.push(error)
                    })
                }
                break

            default:
                break;
        }
    }

    return errors
}

