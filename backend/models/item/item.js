import {Schema, model } from "mongoose";

export const ItemSchema = Schema(
    {
        item_name:{
            type:String,
            required:true
        },
        item_description:{
            type:String
        },
        item_stock:{
            type:Number,
            required:true,
            min:0,
        },
    },
    {
        collection:"items"
    }
)

export const ItemsModel = model("items",ItemSchema)