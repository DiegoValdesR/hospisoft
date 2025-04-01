import {Schema, model } from "mongoose";

const Details = Schema(
    {
        details_amount:{
            type:Number,
            required:true
        },
        details_posology:{
            type:String,
            required:true
        },
        details_consecutive:{
            type:Number,
            required:true
        },
        id_item:{
            type:String,
            required:true
        }
    },
    {
        collection:"details"
    }
)

export const DetailsScheme = model("details",Details)