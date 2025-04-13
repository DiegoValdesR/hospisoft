import {Schema, model } from "mongoose";

export const AppointmentSchema = Schema(
    {
        appointment_date:{
            type:Date,
            required:true
        },
        appointment_time:{
            type:String,
            required:true
        },
        id_patient:{
            type:String,
            required:true
        },
        id_doctor:{
            type:String,
            required:true
        },
        appointment_state:{
            type:String,
            default:"active"
        }
    },
    {
        collection:"appointments"
    }
)

export const AppointmentModel = model("appointments",AppointmentSchema)