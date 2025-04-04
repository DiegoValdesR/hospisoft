import {Schema, model } from "mongoose";

const User = Schema(
    {
        user_name:{
            type:String,
            required:true
        },
        user_last_name:{
            type:String,
            required:true
        },
        user_email:{
            type:String,
            required:true
        },
        user_password:{
            type:String,
            required:true
        },
        user_phone_number:{
            type:String,
            required:true
        },
        user_birthday:{
            type:Date,
            required:true
        },
        user_eps:{
            type:String,
            required:true
        },
        user_role:{
            type:String,
            required:true,
            default:"patient"
        }
        
    },
    {
        collection:"users"
    }
)

export const UsersModel = model("users",User)