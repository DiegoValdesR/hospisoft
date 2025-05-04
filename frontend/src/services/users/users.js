import { API_URL } from "../../API_URL.js";

/**
 * Consigue la información de un usuario en concreto
 * @param {string} userId Id del usuario 
 * @returns {object} Objeto con toda la informacion de un usuario específico
 */
export async function getUserById(userId) {

    const request = await fetch(API_URL + `/users/byid/${userId}`,{credentials:"include"})

    if(request.status === 401){
        return "No has iniciado sesión."
    }

    const requestJSON = await request.json()

    if (requestJSON.status === "error") {
        return requestJSON.message
    }

    return requestJSON
}
/**
 * Método que registra usuarios
 * @param {object} data Toda la información del registro
 * @returns {object} Objeto con un estado y un mensaje,los valores de estos dependiendo de si la operación fue exitosa
 * o no
 */
export async function insertUser(data) {
    try {
        const insert = await fetch(API_URL + `/users/new`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        if (insert.status === 500) {
            throw new Error("Error interno del servidor,por favor intentelo más tarde.")
        }

        const insertJSON = await insert.json()
        if (insertJSON.status === "error") {
            throw new Error(insertJSON.message)
        }

        return {
            status:true,
            message:"Usuario creado correctamente!"
        }
    } catch (error) {
        return {
            status:false,
            message:error.message
        }
    }
}
