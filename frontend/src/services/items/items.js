import { API_URL } from "../../API_URL.js"

export async function insertItem(data) {
    try {
        const insert = await fetch(API_URL + `/items/new`,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        if (insert.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const insertJSON = await insert.json()
        if (insertJSON.status === "error") {
            throw new Error(insertJSON.message)
        }

        return {
            status:true,
            message:"Medicamento registrado!"
        }
    } catch (error) {
        return {
            status:false,
            message:error.message
        }
    }
}

export async function updateItem(itemId,data) {
    try {
        const update = await fetch(API_URL + `/items/update/${itemId}`,{
            method:"PUT",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        if (update.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const updateJSON = await update.json()
        if (updateJSON.status === "error") {
            throw new Error(updateJSON.message)
        }

        return {
            status:true,
            message:"Medicamento actualizado!"
        }
    } catch (error) {
        return {
            status:false,
            message:error.message
        }
    }
}