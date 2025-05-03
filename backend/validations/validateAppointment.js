import moment from "moment-timezone"
/**
 * Valida las fechas de la cita
 * @param {array} arrayDates Array con las fechas de la cita (primero la fecha de inicio)
 * @returns {string} String, vacío si no hay errores o de lo contrario, un mensaje de error
 */
export const validateAppointment = (arrayDates)=>{
    let response = ""
    try {
        if (arrayDates.length !== 2) throw new Error("No se envió todas las fechas.")
        
        if(moment(arrayDates[0]).format("YYYY") < moment().format("YYYY")){   
            throw new Error("No puede agendar una cita para el año pasado")
        }

        if(moment(arrayDates[0]).format("YYYY") >= moment().format("YYYY") + 2){   
            throw new Error("No puede agendar una cita para dentro de 2 años o más")
        }

        if(arrayDates[0] > arrayDates[1]){
            throw new Error("La hora de inicio no puede ser mayor a la final.")
        }

        if (moment(arrayDates[1]).format("YYYY-MM-DD") !== moment(arrayDates[0]).format("YYYY-MM-DD")) {
            throw new Error("La cita debe trasncurrir en el mismo dia.")
        }
        
        if (moment.utc(arrayDates[0]).format("HH:mm") < moment("2025-04-01T06:00").format("HH:mm")){
            throw new Error("Solo se aceptan citas desde las 06:00 am")
        }

        if (moment.utc(arrayDates[0]).format("HH:mm") >= moment("2025-04-01T18:00").format("HH:mm")){
            throw new Error("No se aceptan citas después de las 06:00 pm")
        }
        
        if (moment.utc(arrayDates[1]).format("HH:mm") > moment("2025-04-01T18:00").format("HH:mm")){
            throw new Error("No se aceptan citas después de las 06:00 pm")
        }

        return response
        
    } catch (err) {
        response = err.message
        return response
    }
    
}