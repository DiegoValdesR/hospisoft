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
    },
    {
        collection:"doctors"
    }
)

export const DoctorsModel = model("doctors",Doctor)