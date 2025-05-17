import {Schema, model } from "mongoose";

const WorkerSchema = Schema(
    {
        worker_document:{
            type:Number,
            unique:true,
            dropDups:true,
            required:true,
            minlength:10,
            maxlength:10
        },
        worker_name:{
            type:String,
            required:true
        },
        worker_last_name:{
            type:String,
            required:true
        },
        worker_birthdate:{
            type:Date,
            required:true
        },
        worker_email:{
            type:String,
            unique:true,
            required:true
        },
        worker_password:{
            type:String,
            required:true
        },
        worker_speciality:{
            type:String,
            default:"No aplica"
        },
        worker_phone_number:{
            type:String,
            required:true
        },
        worker_role:{
            type:String,
            default:"secretaria"
        },
        worker_state:{
            type:String,
            default:"active"
        }
    },
    {
        collection:"workers"
    }
)

export const WorkerModel = model("workers",WorkerSchema)