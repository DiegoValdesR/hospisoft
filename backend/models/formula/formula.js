import { Schema,Model, model } from "mongoose";

export const FormulaSchema = Schema(
    {
        formula_date:{
            type:Date,
            default:new Date()
        },
        id_patient:{
            type:String,
            required:true
        },
        id_doctor:{
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