import { Validations } from "../validations/index.js"

export const Middleware = async(schema,model,requestObj)=>{
    const schemaObj = schema.obj
    //extraemos el nombre de la collecton enviada 
    const collectionName = model.collection.name
    const errors = []

    for(const key in requestObj){
        //extraemos el tipo de cada key en el objeto
        const type = schema.paths[key].instance.toLowerCase()

        //revisamos si todos los datos que están marcados como required tengan valores
        const errorValues = Validations.HasRequiredValues(type,schemaObj[key],key,requestObj)
        if (errorValues.hasOwnProperty("type")) errors.push(errorValues)

        //verificamos tipos
        const errorTypes = Validations.HasCorrectTypes(type,key,requestObj[key])
        if (errorTypes.hasOwnProperty("type")) errors.push(errorTypes)

        //verificamos que los valores numéricos sean mayores que el valor minimo
        const errorMinValue = Validations.HasMinValue(schemaObj[key],key,requestObj[key])
        if (errorMinValue.hasOwnProperty("type")) errors.push(errorMinValue)

        //vaidamos fechas
        if (type === "date") {
            let errorDate = {}
            switch (collectionName) {
                case "users":
                    errorDate = Validations.IsValidDate(requestObj[key],"birthdate")
                    break;
            
                default:
                    errorDate = Validations.IsValidDate(requestObj[key],"appointment")
                    break;
            }
            
            if(errorDate.hasOwnProperty("type")) errors.push(errorDate)
        }

        //validamos arrays
        if (type === "array") {
            const errorArray = await Validations.IsValidArray(schema.paths[key],schemaObj[key][0],key,requestObj[key])
            if(errorArray.hasOwnProperty("type")) errors.push(errorArray)
        }
    }

    if (errors.length === 0) {
        //para validaciones especificas 
        switch (collectionName) {
            case "details":
                const errorConsecutive = await Validations.IsConsecutiveValid(requestObj.details_consecutive)
                if (errorConsecutive.hasOwnProperty("type")) errors.push(errorConsecutive)
                break

            case "formula":
                const errorFormula = await Validations.IsFormulaValid(requestObj.id_patient,requestObj.id_doctor)
                if (errorFormula.hasOwnProperty("type")) errors.push(errorFormula)
                break;

            case "appointments":
                const errorAppointment = await Validations.IsAppointmentValid(requestObj.appointment_time,
                requestObj.id_patient,requestObj.id_doctor)

                if (errorAppointment.hasOwnProperty("type")) errors.push(errorAppointment)
                break
        
            default:
                break;
        }
    }
    
    
    return errors
}