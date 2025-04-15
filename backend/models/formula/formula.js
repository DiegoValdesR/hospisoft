import mongoose, { Schema,model } from "mongoose";

export const FormulaSchema = Schema(
    {
        formula_date:{
            type:Date,
            default:new Date()
        },
        patient_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true
        },
        doctor_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"employees",
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