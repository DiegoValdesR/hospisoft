export const IsValidDate = (date,typeOfDate)=>{
    let response = {}
    
    if (date) {
        //dividimos en un arreglo la fecha por cada '-', tienen que haber 3 posiciones si o si
        const splitDate = date.split('-')

        //sino pues chao
        if(splitDate.length < 3){
            return response = {
                type:"Fecha inválida",
                message:`${date} no es una fecha válida.`
            }
        }

        //que todos sean números, sino chao
        if (isNaN(splitDate[0]) || 
            isNaN(splitDate[1]) || 
            isNaN(splitDate[2])
        ) {
            return response = {
                type:"Fecha inválida",
                message:`${date} no es una fecha válida.`
            }
        }

        const dateObject = {
            year:parseInt(splitDate[0]),
            month: parseInt(splitDate[1]),
            day:parseInt(splitDate[2])
        }

        const today = new Date()
        const options = {
            year:{
                min:typeOfDate === "birthdate" ? today.getFullYear() - 90
                : today.getFullYear(),
                max:typeOfDate === "birthdate" ? today.getFullYear() - 18
                : today.getFullYear() + 1
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
                response = {
                    type:"Fecha inválida",
                    message:`${dateObject[key]}(${key}) no puede ser menor que ${options[key].min}.`
                }
                return response
            }

            if (dateObject[key] > options[key].max) {

                if (typeOfDate === "birthdate" && key === "year") {
                    response = {
                        type:"Fecha inválida",
                        message:`No eres mayor de edad.`
                    }
                       
                }else{
                    response = {
                        type:"Fecha inválida",
                        message:`${dateObject[key]}(${key}) no puede ser mayor que ${options[key].max}.`
                    }
                }

                return response
            }
        }

        const newDate = new Date(dateObject.year,dateObject.month - 1,dateObject.day)
        
        if (newDate.getFullYear() !== dateObject.year
            || newDate.getMonth() + 1  !== dateObject.month
            || newDate.getDate() !== dateObject.day 
        ) {
            response = {
                type:"Fecha inválida",
                message:`${date} no es una fecha válida.`
            }
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
                response = {
                    type:"Fecha inválida",
                    message:`No eres mayor de edad.`
                }
            }
        }

    }

    return response
}