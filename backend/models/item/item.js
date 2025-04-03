import {Schema, model } from "mongoose";

const Item = Schema(
    {
        item_name:{
            type:String,
            required:true
        },
        item_description:{
            type:String,
            required:true
        },
        item_stock:{
            type:Number,
            required:true,
        },
    },
    {
        collection:"items"
    }
)

export const ItemsModel = model("items",Item)