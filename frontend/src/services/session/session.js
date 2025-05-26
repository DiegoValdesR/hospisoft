
import { API_URL } from "../../API_URL.js"

export async function getSessionData() {
    try {
        const request = await fetch(API_URL + '/session/data',{credentials:"include"})
        if (request.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const requestJSON = await request.json()
        console.log(requestJSON);
        
        if (requestJSON.status === "error") {
            throw new Error(requestJSON.message)
        }

        return {
            status:true,
            data:requestJSON.data
        }

    } catch (error) {
        return {
            status:false,
            message:error.message
        }
    }
}

/**
 * Cambia la contraseña actual del usuario por la nueva
 * @param {string} new_password Contraseña nueva
 * @param {string} confirm_password Confirmar la contraseña nueva
 * @param {string} email Email de la cuenta del usuario/trabajador
 * @returns {object} Objeto con un estado, y un mensaje de confirmación o error
 */
export async function RecoverPassword(new_password,confirm_password,email) {
    try {
        const request = await fetch(API_URL + '/recoverpass',{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                new_password:new_password,
                confirm_password:confirm_password,
                email:email
            })
        })

        if (request.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const requestJSON = await request.json()

        if (requestJSON.status === "error") {
            throw new Error(requestJSON.message)
        }

        return{
            status:true,
            message:requestJSON.message
        }

    } catch (error) {
        return{
            status:false,
            message:error.message
        }
    }
}
