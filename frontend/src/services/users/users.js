import { API_URL } from "../../API_URL.js";

export async function getAllUsers() {
    try {
        const request = await fetch(API_URL + `/users/all`,{credentials:"include"})

        if(request.status === 500){
            return "Error interno del servidor, por favor intentelo más tarde."
        }

        const requestJSON = await request.json()

        if (requestJSON.status === "error") {
            return requestJSON.message
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
 * Consigue la información de un usuario en concreto
 * @param {string} userId Id del usuario 
 * @returns {object} Objeto con toda la informacion de un usuario específico
 */
export async function getUserById(userId) {

    const request = await fetch(API_URL + `/users/byid/${userId}`,{credentials:"include"})

    if(request.status === 500){
        return "Error interno del servidor, por favor intentelo más tarde."
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
            credentials:"include",
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

/**
 * Método que actualiza usuarios
 * @param {object} data Toda la información para la actualización
 * @returns {object} Objeto con un estado y un mensaje,los valores de estos dependiendo de si la operación fue exitosa
 * o no
 */
export async function updateUser(userId,data) {
    try {
        const insert = await fetch(API_URL + `/users/update/${userId}`,{
            method:"PUT",
            credentials:"include",
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
            message:"Usuario actualizado correctamente!"
        }
        
    } catch (error) {
        return {
            status:false,
            message:error.message
        }
    }
}
