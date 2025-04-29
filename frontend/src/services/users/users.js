import { API_URL } from "../../API_URL.js";

/**
 * Consigue la información de un usuario en concreto
 * @param {string} userId Id del usuario 
 * @returns {object} Objeto con toda la informacion de un usuario específico
 */
export async function getUserById(userId) {
    try {
        const request = await fetch(API_URL + `/users/byid/${userId}`)
        if(!request.ok){
            throw new Error("Ocurrió un error interno del servidor, por favor intentelo más tarde.");
        }

        const requestJSON = await request.json()

        if (requestJSON.status === "error") {
            throw new Error("No se pudo encontrar el usuario.")
        }

        return requestJSON

    } catch (err) {
        console.error(err.message)
        return {
            err_message:err.message,
            ERR_CODE:err.code || 'UNKNOWN_ERROR'
        }
    }
}