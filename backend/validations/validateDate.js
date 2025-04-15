export const IsDateValid = (date,typeOfDate)=>{
    let response = ""
    
    if (date && typeof date === "string") {
        //dividimos en un arreglo la fecha por cada '-', tienen que haber 3 posiciones si o si
        const splitDate = date.split('-')

        //sino pues chao
        if(splitDate.length < 3){
            response = `${date} no es una fecha válida.`
            return response
        }

        //que todos sean números, sino chao
        if (isNaN(splitDate[0]) || 
            isNaN(splitDate[1]) || 
            isNaN(splitDate[2])
        ) {
            response = `${date} no es una fecha válida.`
            return response
        }

        const dateObject = {
            year:parseInt(splitDate[0]),
            month: parseInt(splitDate[1]),
            day:parseInt(splitDate[2])
        }

        let min,max
        const today = new Date()

        switch (typeOfDate) {
            case "birthdate":
                min = today.getFullYear() - 90
                max = today.getFullYear() - 18
                break
            case "appointment":
                min = today.getFullYear()
                max = today.getFullYear() + 1
                break
            case "schedule":
                min = today.getFullYear()
                max = today.getFullYear() + 5
                break
            default:
                break;
        }

        const options = {
            year:{
                min:min,
                max:max
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

                if (key === "year") {
                    switch (typeOfDate) {
                        case "appointment":
                            response = "No puede agendar una cita para un año anterior."
                        break;

                        case "schedule":
                            response = "No puede registrar un horario para un año anterior."
                            break
                    
                        default:
                            response = `El año no puede ser menor que ${options[key].min}`
                            break;
                    }
                }

                if (key === "month") {
                    response = `El mes no puede ser menor que 1.`
                }

                if (key === "day") {
                    response = `El día no puede ser menor que 1.`
                }

                return response
            }
            
            if (dateObject[key] > options[key].max) {
                
                if (key === "year") {
                    switch (typeOfDate) {
                        case "birthdate":
                            response = "No eres mayor de edad."
                            break;

                        case "appointment":
                            response = "No puede agendar una cita para más de un año."
                            break;

                        case "schedule":
                            response = `No puede registrar un horario para dentro de ${options[key].max} años.`
                            break
                    
                        default:
                            response = `El año no puede ser mayor que ${options[key].max}`
                            break;
                    }
                }

                if (key === "month") {
                    response = `El mes no puede ser mayor que 12.`
                }

                if (key === "day") {
                    response = `El dia no puede ser mayor que 31.`
                }

                return response
            }
        }

        const newDate = new Date(dateObject.year,dateObject.month - 1,dateObject.day)
        
        if (newDate.getFullYear() !== dateObject.year
            || newDate.getMonth() + 1  !== dateObject.month
            || newDate.getDate() !== dateObject.day 
        ) {
            response = `${date} no es una fecha válida.`
            return response
        }

        //calculando si cumplió 18 años el dia de hoy (puta madre)
        if (typeOfDate === "birthdate") {
            let age = today.getFullYear() - newDate.getFullYear()
            const monthsDiff = today.getMonth() - newDate.getMonth()

            if (monthsDiff < 0 || (monthsDiff === 0 && today.getDate() < newDate.getDate()) ) {
                age --
            }
            
            if(age < 18){
                response = `No eres mayor de edad.`
            }
        }

    }else{
        response = `${date} no es una fecha válida.`
    }

    return response
}