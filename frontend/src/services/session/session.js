
import { API_URL } from "../../API_URL.js"

export async function getSessionData() {
    try {
        const request = await fetch(API_URL + '/session/data',{credentials:"include"})
        if (request.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const requestJSON = await request.json()
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