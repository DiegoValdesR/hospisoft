export const IsValidDate = (date)=>{
    let response = {}

    if (date) {
            //dividimos en un arreglo la fecha por cada '-', tienen que haber 3 posiciones si o si
        const splitDate = date.split('-')

        //sino pues chao
        if(splitDate.length < 3){
            response = {
                type:"Fecha inválida",
                message:`${date} no es una fecha válida.`
            }
            return response
        }

        //que todos sean números, sino chao
        if (isNaN(splitDate[0]) || 
            isNaN(splitDate[1]) || 
            isNaN(splitDate[2])
        ) {
            response = {
                type:"Fecha inválida",
                message:`${date} no es una fecha válida.`
            }
            return response
        }

        const dateObject = {
            year:parseInt(splitDate[0]),
            month: parseInt(splitDate[1]),
            day:parseInt(splitDate[2])
        }

        const options = {
            year:{
                min:new Date().getFullYear() - 90,
                max:new Date().getFullYear() - 18
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
                    message:`${dateObject[key]} no puede ser menor que ${options[key].min}.`
                }
                return response
            }

            if (dateObject[key] > options[key].max) {
                response = {
                    type:"Fecha inválida",
                    message:`${dateObject[key]} no puede ser mayor que ${options[key].max}.`
                }
                return response
            }
        }

        const birthDate = new Date(dateObject.year,dateObject.month - 1,dateObject.day)
        
        if (birthDate.getFullYear() !== dateObject.year
            || birthDate.getMonth() + 1  !== dateObject.month
            || birthDate.getDate() !== dateObject.day 
        ) {
            response = {
                type:"Fecha inválida",
                message:`${date} no es una fecha válida.`
            }
            return response
        }

        //calculando si cumplió 18 años el dia de hoy (puta madre)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthsDiff = today.getMonth() - birthDate.getMonth()

        if (monthsDiff < 0 || (monthsDiff === 0 && today.getDate() < birthDate.getDate()) ) {
            age --
        }
        
        if(age < 18){
            response = {
                type:"Fecha inválida",
                message:`No eres mayor de edad.`
            }
        }

    }

    return response
}