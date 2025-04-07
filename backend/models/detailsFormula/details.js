import {Schema, model } from "mongoose";

export const DetailSchema = Schema(
    {
        details_posology:{
            type:String,
            required:true
        },
        details_consecutive:{
            type:String,
            required:true
        },
        item:[
            {
                id_item:{
                    type:String,
                    required:true
                },
                amount_item:{
                    type:Number,
                    required:true
                }
            }
        ]
        
    },
    {
        collection:"details"
    }
)

export const DetailsModel = model("details",DetailSchema)