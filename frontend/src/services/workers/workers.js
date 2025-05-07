import { API_URL } from "../../API_URL.js"

export async function getAllDoctors() {
    try {
        const request = await fetch(API_URL + `/workers/alldoctors`,{credentials:"include"})

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
 * Método que registra usuarios
 * @param {object} data Toda la información del registro
 * @returns {object} Objeto con un estado y un mensaje,los valores de estos dependiendo de si la operación fue exitosa
 * o no
 */
export async function insertWorker(data) {
    try {
        const insert = await fetch(API_URL + `/workers/new`,{
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
            message:"Empleado creado correctamente!"
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
export async function updateWorker(workerId,data) {
    try {
        const insert = await fetch(API_URL + `/workers/update/${workerId}`,{
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
            message:"Empleado actualizado correctamente!"
        }
        
    } catch (error) {
        return {
            status:false,
            message:error.message
        }
    }
}
