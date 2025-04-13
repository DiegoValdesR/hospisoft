import { UsersModel } from "../../models/user/user.js"
import { DoctorsModel } from "../../models/doctor/doctor.js"
import { Validations } from "../index.js"

export const IsFormulaValid = async(id_patient,id_doctor)=>{
    let response = {}

    if (id_patient.length !== 24) {
        response = {
            type:"Error de id",
            message:"No se encontró el paciente asociado a ese id."
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

    if (!await Validations.IsIdValid(id_doctor,DoctorsModel)) {
        response = {
            type:"Error de id",
            message:"No se encontró el médico asociado a ese id."
        }

        return response
    }

    return response
}