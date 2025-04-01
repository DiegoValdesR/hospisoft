import {Schema, model } from "mongoose";

const Doctor = Schema(
    {
        doctor_name:{
            type:String,
            required:true
        },
        doctor_last_name:{
            type:String,
            required:true
        },
        doctor_medico:{
            type:String,
            required:true
        },
        doctor_speciality:{
            type:String,
            required:true
        }
    },
    {
        collection:"doctors"
    }
)

export const DoctorScheme = model("doctors",Doctor)