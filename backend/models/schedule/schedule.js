import mongoose, { Schema,model } from "mongoose";

const ScheduleSchema = Schema({
    worker_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"workers",
        required:true
    },
    schedule_date:{
        type:Date,
        required:true
    },
    hour_start:{
        type:String,
        requred:true
    },
    hour_end:{
        type:String,
        requred:true
    },
    schedule_area:{
        type:String,
        required:true
    },
    schedule_state:{
        type:String,
        default:"active"
    }

},
{
    collection:"schedule"
})

export const ScheduleModel = model('schedule',ScheduleSchema)

