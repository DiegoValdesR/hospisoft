import {Schema, model } from "mongoose";

export const DoctorSchema = Schema(
    {
        doctor_name:{
            type:String,
            required:true
        },
        doctor_last_name:{
            type:String,
            required:true
        },
        doctor_speciality:{
            type:String,
            required:true
        },
        doctor_email:{
            type:String,
            required:true
        },
        doctor_password:{
            type:String,
            required:true
        },
        doctor_phone_number:{
            type:String,
            required:true
        },
        doctor_state:{
            type:String,
            default:"active"
        }
    },
    {
        collection:"doctors"
    }
)

export const DoctorsModel = model("doctors",DoctorSchema)