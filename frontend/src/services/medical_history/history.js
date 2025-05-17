import { API_URL } from "../../API_URL.js"
import moment from "moment-timezone"

export async function getAllHistories() {
    try {
        const request = await fetch(API_URL + `/medical_history/all`,{credentials:"include"})
        if (request.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const requestJSON = await request.json()
        const allHistories = requestJSON.data.length > 0 ? await userHistory(requestJSON.data) : []

        if (!Array.isArray(allHistories)) {
            throw new Error(allHistories.message)
        }

        return {
            status:true,
            data:allHistories
        }

    } catch (error) {
        return{
            status:false,
            message:error.message
        }
    }
}

export async function getHistoryById(id) {
    try {
        const request = await fetch(API_URL + `/medical_history/byid/${id}`,{credentials:"include"})
        if (request.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const requestJSON = await request.json()
        if (requestJSON.status === "error") {
            throw new Error(requestJSON.message)
        }

        const {patient_id,doctor_id} = requestJSON.data

        const userInfo = await fetch(API_URL + `/users/byid/${patient_id}`,{credentials:"include"})
        const doctorInfo = await fetch(API_URL + `/workers/byid/${doctor_id}`,{credentials:"include"})

        if (!userInfo.ok || !doctorInfo.ok) {
            throw new Error("Ocurrió un error, por favor intentelo más tarde.")
        }

        const userInfoJSON = await userInfo.json()
        const doctorInfoJSON = await doctorInfo.json()

        const data = {
            patient:`${userInfoJSON.data.user_name} ${userInfoJSON.data.user_last_name}`,
            doctor:`${doctorInfoJSON.data.worker_name} ${doctorInfoJSON.data.worker_last_name}`,
            reason:requestJSON.data.reason,
            diagnosis:requestJSON.data.diagnosis,
            treatment:requestJSON.data.treatment,
            date:requestJSON.data.createdAt
        }

        return {
            status:true,
            data:data
        }

    } catch (error) {
        return{
            status:false,
            message:error.message
        }
    }
}

export async function getHistoriesByPatient(patientId) {
    try {
        const request = await fetch(API_URL + `/medical_history/bypatient/${patientId}`,{credentials:"include"})
        if (request.status === 500) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.")
        }

        const requestJSON = await request.json()
        const allHistories = requestJSON.data.length > 0 ? await userHistory(requestJSON.data) : []

        if (!Array.isArray(allHistories)) {
            throw new Error(allHistories.message)
        }

        return {
            status:true,
            data:allHistories
        }

    } catch (error) {
        return{
            status:false,
            message:error.message
        }
    }
}

export async function insertHistory(data) {
    try {
        const insert = await fetch(API_URL + '/medical_history/new',{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        if (insert.status === 500) {
            throw new Error("Error interno del servidor, intentelo más tarde.")
        }

        const insertJSON = await insert.json()
        if (insertJSON.status === "error") {
            throw new Error(insertJSON.message)
        }

        return {
            status:true,
            message:insertJSON.message
        }

    } catch (error) {
        return {
            status:false,
            message:error.message
        }
    }
}

/**
 * Recibe los datos y los adapta para mostrarlos
 * @param {array} data Array con la informacion traida de la base de datos
 * @returns {array} Array con la información adaptada
 */
async function userHistory(data) {
    try {
        const historyArray = []

            for (const object of data){
                const {patient_id,doctor_id} = object
                const userInfo = await fetch(API_URL + `/users/byid/${patient_id}`,{credentials:"include"})
                if (!userInfo.ok) {
                    throw new Error("No se pudo conseguir todos los usuarios.")
                }
                const doctorInfo = await fetch(API_URL + `/workers/byid/${doctor_id}`,{credentials:"include"})
                if (!doctorInfo.ok) {
                    throw new Error("No se pudo conseguir todos los usuarios.")
                }
    
                const userInfoJSON = await userInfo.json()
                const doctorInfoJSON = await doctorInfo.json()
    
                const historyInfo = {
                    _id:object["_id"],
                    patient:`${userInfoJSON.data.user_name} ${userInfoJSON.data.user_last_name}`,
                    doctor:`${doctorInfoJSON.data.worker_name} ${doctorInfoJSON.data.worker_last_name}`,
                    date:moment(object.createdAt).format('DD/MM/YYYY')
                }
                
                historyArray.push(historyInfo)
            }

        return historyArray

    } catch (error) {
        console.error(error)
        return {
            status:false,
            message:"Ocurrió un error, por favor intentelo más tarde."
        }
    }
    

}