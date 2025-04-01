import {Schema, model } from "mongoose";

const User = Schema(
    {
        user_name:{
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
        }
    },
    {
        collection:"users"
    }
)

export const UserScheme = model("users",User)