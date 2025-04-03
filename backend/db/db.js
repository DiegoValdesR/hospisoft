import { config } from "dotenv";
import mongoose from "mongoose";
config()
const {MONGO_URI} = process.env

export const MongoDbConnection = async() =>{
    try{
        await mongoose.connect(MONGO_URI)
    }catch(err){
        console.error(err)
    }
}
