import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export const AuthorizationToken = (req,res,next)=>{
    const authHeaders = req.headers["authorization"]
    const token = authHeaders && authHeaders
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