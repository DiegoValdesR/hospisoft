import jwt from 'jsonwebtoken'
import { config } from "dotenv"
//cargo las variables de entorno
config()

/**
 * @req Metodo request de express
 * @roles Array que recibe los roles permitidos para esa funcion 
 */

export const AdmittedRoles = (req,roles)=>{
    const token = req.headers["authorization"].split("/")[1]
    const loginData = jwt.verify(token,process.env.SECRET)
    
    if (!roles.includes(loginData.role)) {
        return "No tienes acceso a esta función."
    }

    return true
}