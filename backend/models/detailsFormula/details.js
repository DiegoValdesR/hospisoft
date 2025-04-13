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
        ],
        details_state:{
            type:String,
            default:"active"
        }
        
    },
    {
        collection:"details"
    }
)

export const DetailsModel = model("details",DetailSchema)