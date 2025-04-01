import {Schema, model } from "mongoose";

const Item = Schema(
    {
        item_description:{
            type:Number,
            required:true
        },
        item_stock:{
            type:Number,
            required:true
        },
    },
    {
        collection:"items"
    }
)

export const DetailsScheme = model("items",Item)