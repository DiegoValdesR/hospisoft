import { API_URL } from "../../API_URL.js";

/**
 * Consigue la información de un usuario en concreto
 * @param {string} userId Id del usuario 
 * @returns {object} Objeto con toda la informacion de un usuario específico
 */
export async function getUserById(userId) {

    const request = await fetch(API_URL + `/users/byid/${userId}`,{credentials:"include"})

    if(!request.status === 401){
        return "No has iniciado sesión."
    }

    const requestJSON = await request.json()

    if (requestJSON.status === "error") {
        return requestJSON.message
    }

    return requestJSON
}
