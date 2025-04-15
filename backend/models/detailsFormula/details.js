import mongoose, {Schema, model } from "mongoose";

export const DetailSchema = new Schema(
    {
        details_posology:{
            type:String,
            required:true
        },
        details_consecutive:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"formula",
            required:true
        },
        items:[
            {
                item_id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"items",
                    required:true
                },
                item_amount:{
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