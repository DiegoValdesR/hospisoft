import {Schema,model} from 'mongoose'

const MedicalSchema = Schema({
    patient_id:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    diagnosis:{
        type:String,
        required:true
    },
    treatment:{
        type:String,
        required:true
    },
    doctor_id:{
        type:Schema.Types.ObjectId,
        ref:"workers",
        required:true
    },
    state:{
        type:String,
        default:"active"
    }

},
{
    timestamps:true,
    collection:"medical_history"
})

export const MedicalModel = model("medical_history",MedicalSchema)