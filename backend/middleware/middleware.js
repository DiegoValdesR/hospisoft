import { Validations } from "../validations/index.js"

export const Middleware = (schema,requestBody)=>{
    const schemaObj = schema.obj
    const errors = []

    for(const key in schemaObj){
        //extraemos el tipo de cada key en el objeto
        const type = schema.paths[key].instance.toLowerCase()

        //revisamos si todos los datos que están marcados como required tengan valores
        const errorValues = Validations.HasRequiredValues(type,schemaObj[key],key,requestBody)
        if (errorValues.hasOwnProperty("type")) errors.push(errorValues)

        //verificamos tipos
        const errorTypes = Validations.HasCorrectTypes(type,key,requestBody[key])
        if (errorTypes.hasOwnProperty("type")) errors.push(errorTypes)

        //verificamos que los valores numéricos sean mayores que el valor minimo
        const errorMinValue = Validations.HasMinValue(schemaObj[key],key,requestBody[key])
        if (errorMinValue.hasOwnProperty("type")) errors.push(errorMinValue)

        //vaidamos fechas
        if (type === "date") {
            const errorDate = Validations.IsValidDate(requestBody[key])
            if(errorDate.hasOwnProperty("type")) errors.push(errorDate)
        }

        //validamos arrays
        if (type === "array") {
            const errorArray = Validations.IsValidArray(schema,key,requestBody[key])
            if(errorArray.hasOwnProperty("type")) errors.push(errorArray)
        }
    
    }

    return errors
}