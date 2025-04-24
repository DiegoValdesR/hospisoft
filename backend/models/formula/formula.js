import mongoose, { Schema,model } from "mongoose";

export const FormulaSchema = Schema(
    {
        formula_date:{
            type:Date,
            default:Date.now
        },
        patient_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true
        },
        doctor_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"workers",
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
        posology:{
            type:String,
            required:true
        },
        formula_state:{
            type:String,
            default:"active"
        }
    },
    {
        collection:"formula"
    }
)

export const FormulaModel = model('formula',FormulaSchema)