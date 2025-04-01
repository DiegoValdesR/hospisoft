import {Schema, model } from "mongoose";

const Patient = Schema(
    {
        patient_name:{
            type:String,
            required:true
        },
        patient_last_name:{
            type:String,
            required:true
        },
        patient_email:{
            type:String,
            required:true
        },
        patient_phone_number:{
            type:String,
            required:true
        },
        patient_birthday:{
            type:Date,
            required:true
        },
        patient_eps:{
            type:String,
            required:true
        },
        patient_user:{
            type:String,
            required:true
        },
        patient_password:{
            type:String,
            required:true
        },
        
    },
    {
        collection:"patients"
    }
)

export const DetailsScheme = model("patients",Patient)