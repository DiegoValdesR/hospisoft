export const IsHourValid = (hour,typeOfHour = "no aplica")=>{
    let response = ""

    if (typeof hour !== "string" || hour === "") {
        response = "No se ingresó una fecha válida."
        return response
    }

    const splitHour = hour.split(':')
    
    if (splitHour.length !== 2 || splitHour.find(hour => isNaN(hour))) {
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

    return response
}