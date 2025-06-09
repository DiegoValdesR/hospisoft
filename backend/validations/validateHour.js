/**
 * Valida una o más horas en formato 'HH:MM' según el tipo especificado,
 * verificando formato, rango permitido y consistencia entre horas (inicio y fin).
 *
 * @param {array} hours - Arreglo de cadenas con horas en formato 'HH:MM' a validar.
 * @param {string} [typeOfHour="no aplica"] - Tipo de hora para validar reglas específicas. Puede ser:
 *                                            - "appointment": valida horas entre 6 a.m. y 6 p.m.
 *                                            - cualquier otro valor: valida horas entre 0 y 23.
 *
 * @returns {string} - Mensaje vacío si las horas son válidas, o mensaje de error indicando el motivo.
 */
export const IsHourValid = (hours = [],typeOfHour = "no aplica")=>{
    let response = ""

    for(const hour of hours){
        if (typeof hour !== "string" || hour === "") {
            response = "No se ingresó una hora válida."
            return response
        }

        const splitHour = hour.split(':')

        if (splitHour.length !== 2 || splitHour.find(hora => isNaN(hora))) {
            response = `${hour} no es una hora válida.`
            return response
        }

        let min,max
        switch (typeOfHour) {
            case "appointment":
                min = 6
                max = 18
                break;
        
            default:
                min = 0
                max = 23
                break;
        }

        const options = {
            hour:{
                min:min,
                max:max
            },
            minutes:{
                min:0,
                max:59
            }
        }

        const hourObject = {
            hour:splitHour[0],
            minutes:splitHour[1]
        }

        for(const key in options){
            if (hourObject[key] < options[key].min) {
    
                if (key === "hour" && typeOfHour === "appointment") {
                    response = `No se aceptan citas médicas antes de las 6 a.m.`
                }else{
                    response = `${hourObject[key]}(${key}) no puede ser menor que ${options[key].max}.`
                }
                
                return response
            }
    
            if (hourObject[key] > options[key].max) {
    
                if (key === "hour" && typeOfHour === "appointment") {
                    response = `No se aceptan citas médicas después de las 6 p.m.`
                }else{
                    response = `${hourObject[key]}(${key}) no puede ser mayor que ${options[key].max}.`
                }
    
                return response
            }
        }
        
    }

    if (hours[0] > hours[1]) {
        response = `La hora de inicio no puede ser mayor que la hora de finalización.`
        return response
    }

    return response
}