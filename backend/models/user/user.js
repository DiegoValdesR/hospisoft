import {Schema, model } from "mongoose";

const UserSchema = Schema(
    {
        user_document:{
            type:Number,
            unique:true,
            dropDups:true,
            required:true,
            minlength:10,
            maxlength:10
        },
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
            unique:true,
            required:true
        },
        user_password:{
            type:String,
            required:true,
            minlength:6,
        },
        user_phone_number:{
            type:String,
            required:true
        },
        user_birthdate:{
            type:Date,
            required:true
        },
        user_eps:{
            type:String,
            required:true
        },
        user_state:{
            type:String,
            default:"active"
        }
    },
    {
        collection:"users"
    }
)

export const UsersModel = model("users",UserSchema)