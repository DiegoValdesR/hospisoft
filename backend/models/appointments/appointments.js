import mongoose,{Schema, model } from "mongoose";

const AppointmentSchema = Schema(
    {
        start_date:{
            type:Date,
            required:true
        },
        end_date:{
            type:Date,
            required:true
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
        appointment_state:{
            type:String,
            default:"active"
        },
        appointment_price:{
            type:Number,
            default:10000
        }
    },
    {
        collection:"appointments"
    }
)

export const AppointmentModel = model("appointments",AppointmentSchema)