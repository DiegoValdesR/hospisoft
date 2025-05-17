import { API_URL } from "../../API_URL.JS"
/**
 * Valida que el correo ingresado existe en la base de datos y genera el token de recuperacion
 * @param {string} email Correo ingresado por el usuario 
 * @returns {object} Objeto con un estado y un mensaje dependiendo de la validez del correo.
 */
export async function GenToken(email) {
    try {
        const request = await fetch(API_URL + '/tokens/new',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email:email})
        })

        if (request.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const requestJSON = await request.json()
        if (requestJSON.status === "error") {
            throw new Error(requestJSON.message)
        }

        return {
            status:true,
            message:"Correo enviado correctamente!"
        }

    } catch (error) {
        return {
            status:false,
            message:error.message
        }
    }
}