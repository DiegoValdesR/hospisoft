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
export async function getApointments(){
    try {
        const request = await fetch(API_URL + `/appointments/all`)
        if(!request.ok){
            throw new Error("Ocurrió un error interno del servidor, por favor intentelo más tarde.");
        }

        const requestJSON = await request.json()
        if (requestJSON.status === "error") {
            throw new Error(requestJSON.message);
        }

        const events = getEvents(requestJSON)
        if (!Array.isArray(events)) {
            throw new Error(events.err_message)
        }
        
        return events

    } catch (err) {
        console.error(err.message)
        return {
            err_message:err.message,
            ERR_CODE:err.code || 'UNKNOWN_ERROR'
        }
    }
}

/**
 * Adapta la informacion de las citas para ser mostrada en el calendario
 * @param {object} appointmentsJSON Objeto JSON que contiene un array de objetos con todas las citas 
 * @returns {array} Array de objetos con todos los eventos
 */
export async function getEvents(appointmentsJSON) {
    const arrayEvents = []
    for(const appointment of appointmentsJSON.data){
        const {appointment_date,hour_start,hour_end,patiend_id} = appointment
        
        const user = await getUserById(patiend_id)

        if (user.hasOwnProperty("err_message")) {
            return user
        }

        const date = {
            year:moment.utc(appointment_date).format('YYYY'),
            month:moment.utc(appointment_date).format('MM'),
            day:moment.utc(appointment_date).format('DD'),
        }
    
        //armamos las distintas partes del objeto
        const start = moment(`${date.year}-${date.month}-${date.day}T${hour_start}`).toDate()
        const end = moment(`${date.year}-${date.month}-${date.day}T${hour_end}`).toDate()
        const title = `Cita ${user.user_name} ${user.user_last_name} (${moment(start).format('hh:mm a')})`
    
        const data = {
        title:title,
        start:start,
        end:end,
        schedule_data:{
            _id:schedule._id,
            worker_id:schedule.worker_id,
            title:schedule.title,
            schedule_start_date:schedule_start_date.split("T")[0],
            schedule_final_date:schedule_final_date.split("T")[0],
            hour_start:hourStart,
            hour_end:hourEnd,
            schedule_area:schedule.schedule_area
            }
        }
                
        arrayEvents.push(data)
    }
    
    return arrayEvents
}