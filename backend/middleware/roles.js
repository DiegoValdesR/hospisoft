import jwt from 'jsonwebtoken'
import { config } from "dotenv"
//cargo las variables de entorno
config()

/**
 * @param {*} req Metodo request de express
 * @param {array} roles Array que recibe los roles permitidos para esa funcion, en strings,
 * ej: ["admin","secretaria"]
 */
export const AdmittedRoles = (req,roles)=>{
    const token = req.cookies.token
    const loginData = jwt.verify(token,process.env.SECRET)
    
    if (!roles.includes(loginData.role)) {
        return "No tienes acceso a esta función."
    }

    return true
}