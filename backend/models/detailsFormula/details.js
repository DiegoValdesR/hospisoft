import {Schema, model } from "mongoose";

export const DetailSchema = new Schema(
    {
        details_posology:{
            type:String,
            required:true
        },
        details_consecutive:{
            type:String,
            required:true
        },
        items:[
            {
                id_item:{
                    type:String,
                    required:true
                },
                amount_item:{
                    type:Number,
                    required:true,
                    min:1
                }
            }
        ]
        
    },
    {
        collection:"details"
    }
)

export const DetailsModel = model("details",DetailSchema)