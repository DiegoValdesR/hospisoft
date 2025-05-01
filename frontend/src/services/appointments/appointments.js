import moment from 'moment-timezone'
moment.tz.setDefault('America/Bogota')
import { API_URL } from '../../API_URL.js'
import { getUserById } from '../users/users.js'

/**
 * Insertar citas
 * @param {object} data Objeto con la información a insertar
 * @returns {object} Objeto con la respuesta del servidor
 */
export async function insertAppointment(data) {
    try {
        const insert = await fetch(API_URL + "/appointments/new",{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        if (!insert.ok) {
            throw new Error("Error interno del servidor, por favor intentelo más tarde.");
        }

        const insertJSON = await insert.json()
        if (insertJSON.status === "error") {
            throw new Error(insertJSON.message)
        } 

        return {
            status:true,
            message:"Cita agendada!"
        }

    } catch (err) {
        console.error(err.message)
        return {
            status:false,
            err_message:err.message,
            ERR_CODE:err.code || 'UNKNOWN_ERROR'
        }
    }
}

/**
 * Consigue todas las citas y las guarda en un array de objetos
 * @returns {array} Array de objetos con todos los eventos para el calendario
 */
export const getApointments = async()=>{
    try {
        const request = await fetch(API_URL + `/appointments/all`,{credentials:"include"})

        if(!request.ok){
            throw new Error("Ocurrió un error interno del servidor, por favor intentelo más tarde.");
        }

        const requestJSON = await request.json()
        if (requestJSON.status === "error") {
            throw new Error(requestJSON.message)
        }

        const events = await Promise.resolve(getEvents(requestJSON))
        
        if (!Array.isArray(events)) {
            throw new Error(events)
        }
        
        return events

    } catch (err) {
        console.error(err)
        return err.message
    }
}

/**
 * Adapta la informacion de las citas para ser mostrada en el calendario
 * @param {object} appointmentsJSON Objeto JSON que contiene un array de objetos con todas las citas 
 * @returns {array} Array de objetos con todos los eventos
 */
const getEvents = async(appointmentsJSON)=>{
    const arrayEvents = []
    for(const appointment of appointmentsJSON.data){
        const {start_date,end_date,patient_id} = appointment
    
        const user = await getUserById(patient_id)

        if (typeof user === "string") {
            return user
        }
        //dividimos las fechas en objetos (putas zonas horarias)
        const startObj = {
            year:moment.utc(start_date).format('YYYY'),
            month:moment.utc(start_date).format('MM'),
            day:moment.utc(start_date).format('DD'),
        }

        const endObj = {
            year:moment.utc(end_date).format('YYYY'),
            month:moment.utc(end_date).format('MM'),
            day:moment.utc(end_date).format('DD'),
        }

        const hourStart = moment.utc(start_date).format('hh:mm')
        const hourEnd = moment.utc(end_date).format('hh:mm')
        
        const start = moment(`${startObj.year}-${startObj.month}-${startObj.day}T${hourStart}`).toDate()
        const end = moment(`${endObj.year}-${endObj.month}-${endObj.day}T${hourEnd}`).toDate()
    
        const title = `Cita para ${user.data.user_name} ${user.data.user_last_name}`
    
        const data = {
            title:title,
            start:start,
            end:end,
            appointment_data:{
                _id:appointment._id,
                start_date:start_date,
                end_date:end_date,
                patiend_id:patient_id,
                doctor_id:appointment.doctor_id
            }
        }
        
        arrayEvents.push(data)
    }
    
    return arrayEvents
}