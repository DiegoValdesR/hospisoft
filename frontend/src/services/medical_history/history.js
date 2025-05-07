import { API_URL } from "../../API_URL.js"

export async function getAllHistories() {
    try {
        const request = await fetch(API_URL + `/medical_history/all`,{credentials:"include"})
        if (!request.ok) {
            throw new Error(request.statusText)
        }

        const requestJSON = await request.json()
        const allHistory = requestJSON.data.length > 0 ? await userHistory(requestJSON.data) : []

        
        if (!Array.isArray(allHistory)) {
            throw new Error(allHistory.message)
        }

        return {
            status:true,
            data:allHistory
        }

    } catch (error) {
        return{
            status:false,
            message:error.message
        }
    }
}

export async function insertHistory(data) {
    
}

async function userHistory(data) {
    const historyArray = []

    try {
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
                reason:object.reason,
                diagnosis:object.reason,
                treatment:object.treatment,
                date:object.createdAt
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