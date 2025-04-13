import { UsersModel } from "../../models/user/user.js";
import { DoctorsModel } from "../../models/doctor/doctor.js";

export const IsAppointmentValid = async(hour,id_patient,id_doctor)=>{
    let response = {}

    const splitHour = hour.split(':')
    
    if (splitHour.length !== 2 || splitHour.find(hour => isNaN(hour))) {
        response = {
            type:"Hora incorrecta",
            message:`${hour} no es una hora válida.`
        }
        return response
    }

    const options = {
        hour:{
            min:6,
            max:18
        },
        minutes:{
            min:0,
            max:59
        }
    }

    const hourObject = {
        hour:splitHour[0],
        minutes:splitHour[1]
    }

    for(const key in options){
        if (hourObject[key] < options[key].min) {
            response = {
                type:"Hora inválida",
                message:`${hourObject[key]}(${key}) no puede ser menor que ${options[key].min}.`
            }
            return response
        }

        if (hourObject[key] > options[key].max) {
            response = {
                type:"Hora inválida",
                message:`${hourObject[key]}(${key}) no puede ser mayor que ${options[key].max}.`
            }
            return response
        }
    }

    if (id_patient.length !== 24) {
        response = {
            type:"Error de id",
            message:"No se encontró el paciente asociado a ese id."
        }
        return response
    }

    if (id_doctor.length !== 24) {
        response = {
            type:"Error de id",
            message:"No se encontró el doctor asociado a ese id."
        }
        return response
    }
    
    let findPatient = {}
    findPatient = await UsersModel.findOne({"_id":id_patient,"user_role":"paciente","user_state":"active"})
    
    if (!findPatient) {
        response = {
            type:"Error de id",
            message:"No se encontró el paciente asociado a ese id."
        }
        return response
    }

    let findDoctor = {}
    findDoctor = await DoctorsModel.findOne({"_id":id_doctor,"doctor_state":"active"})
    
    if (!findDoctor) {
        response = {
            type:"Error de id",
            message:"No se encontró el médico asociado a ese id."
        }
        return response
    }
    
    return response
}