import { model,Schema } from 'mongoose'

const RecoveryTokens = Schema({
        token:{
            type:String,
            required:true,
            unique:true,
            dropDups:true,
            minlength:6,
            maxlength:6
        },
        user_id:{
            type:Schema.Types.ObjectId,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now,
            expires:300
        },
        used:{
            type:Boolean,
            default:false
        }
    },
    {
        collection:"tokens"
    }
)

export const TokensModel = model('tokens',RecoveryTokens)