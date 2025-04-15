import {Schema, model } from "mongoose";

const EmployeeSchema = Schema(
    {
        employee_name:{
            type:String,
            required:true
        },
        employee_last_name:{
            type:String,
            required:true
        },
        employee_birthdate:{
            type:Date,
            required:true
        },
        employee_email:{
            type:String,
            required:true
        },
        employee_password:{
            type:String,
            required:true
        },
        employee_speciality:{
            type:String,
            default:"No aplica"
        },
        employee_phone_number:{
            type:String,
            required:true
        },
        employee_role:{
            type:String,
            default:"secretaria"
        },
        employee_state:{
            type:String,
            default:"active"
        }
    },
    {
        collection:"employees"
    }
)

export const EmployeeModel = model("doctors",EmployeeSchema)