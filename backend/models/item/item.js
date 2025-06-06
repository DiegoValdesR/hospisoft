import {Schema, model } from "mongoose";

const ItemSchema = Schema(
    {
        item_name:{
            type:String,
            required:true
        },
        item_description:{
            type:String,
            default:"No aplica."
        },
        item_stock:{
            type:Number,
            required:true,
            min:0,
        },
        item_price:{
            type:Number,
            required:true,
            min:1
        }
    },
    {
        collection:"items"
    }
)

export const ItemsModel = model("items",ItemSchema)