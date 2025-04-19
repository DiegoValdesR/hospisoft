import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

/**
 * 
 * @param {*} req Método request de express
 * @param {*} res Método response de express
 * @param {*} next Metodo de express, en este caso lo que hace es continuar el método más cercano si el token
 * no es inválido
 * @returns 
 */

export const AuthorizationToken = (req,res,next)=>{
    const authHeaders = req.headers["authorization"]
    const token = authHeaders && authHeaders.split("/")[1]
    if (!token) {
        return res.status(401).send({
            status:"error",
            message:"No has iniciado sesión."
        })
    }

    jwt.verify(token,process.env.SECRET,(err)=>{
        if(err){
            return res.status(403).send({
                status:"error",
                message:"El token es inválido u ha expirado."
            })
        }
        next()
    })

}