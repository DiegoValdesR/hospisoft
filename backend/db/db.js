import { config } from "dotenv";
import mongoose from "mongoose";
config()
const {MONGO_URI} = process.env

/**
 * Establece la conexión con la base de datos MongoDB usando la URI configurada en variables de entorno.
 *
 * @param {Request} req - No aplica, función no recibe parámetros.
 * @param {Response} res - No aplica, función no recibe parámetros.
 * @returns {Promise<void>} - Promise que resuelve si la conexión fue exitosa o imprime error en consola.
 */
export const MongoDbConnection = async() =>{
    try{
        await mongoose.connect(MONGO_URI)
    }catch(err){
        console.error(err)
    }
}
