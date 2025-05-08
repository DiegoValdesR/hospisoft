import moment from "moment";
import { API_URL } from "../../API_URL"
/**
 * Realiza petición a la API para obtener información de un trabajador específico
 * @param {string} workerId - ID del trabajador
 * @returns {*} Array con los eventos de un tabajador en especifico o un objeto con un mensaje de error
 */
export async function scheduleByWorker(workerId){
    try {
        const request = await fetch(API_URL + `/schedules/byworker/${workerId}`,{credentials:"include"})
        if(request.status === 500){
            throw new Error("Ocurrió un error interno del servidor, por favor intentelo más tarde.");
        }

        const requestJSON = await request.json()
        if (requestJSON.status === "error") {
            throw new Error(requestJSON.message);
        }

        const events = getEvents(requestJSON)
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
 * Consigue todos los horarios registrados
 * @returns {array} Array con todos los eventos 
 */
export async function allSchedules() {
    try {
        const request = await fetch(API_URL + `/schedules/all`,{
            credentials:"include"
        })

        if(request.status === 500){
            throw new Error("Ocurrió un error interno del servidor, por favor intentelo más tarde.");
        }

        const requestJSON = await request.json()
        if (requestJSON.status === "error") {
            throw new Error(requestJSON.message);
        }

        const events = getEvents(requestJSON)
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
 * Adapta los datos para mostrar los eventos del calendario
 * @param {object} schedulesJSON - Array de objetos con la informacion de los horarios
 * @returns {array} Array de objetos con todos los horarios registrados
 */
function getEvents(schedulesJSON){
    const arrayEvents = []
    for(const schedule of schedulesJSON.data){
        const {schedule_start_date,schedule_final_date} = schedule

        const startDate = {
            year:moment.utc(schedule_start_date).format('YYYY'),
            month:moment.utc(schedule_start_date).format('MM'),
            day:moment.utc(schedule_start_date).format('DD'),
        }
            
        const endDate = {
            year:moment.utc(schedule_final_date).format('YYYY'),
            month:moment.utc(schedule_final_date).format('MM'),
            day:moment.utc(schedule_final_date).format('DD'),
        }

        const hourStart = schedule.hour_start
        const hourEnd = schedule.hour_end

        //armamos las distintas partes del objeto
        const start = moment(`${startDate.year}-${startDate.month}-${startDate.day}T${hourStart}`).toDate()
        const end = moment(`${endDate.year}-${endDate.month}-${endDate.day}T${hourEnd}`).toDate()
        const title = `${schedule.title} (${moment(start).format('hh:mm a')} a ${moment(end).format('hh:mm a')})`

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
