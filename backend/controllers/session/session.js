import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { config } from "dotenv"
config()

/**
 * Inicia sesión validando el correo y la contraseña, genera un JWT y lo guarda en cookies.
 *
 * @param {Request} req - Objeto de solicitud con `email` y `password` en el cuerpo.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Devuelve estado de la sesión e información relevante.
 */
const LogIn = async(req,res) =>{
    const { email,password} = req.body

    if (!email || !password) {
        return res.status(400).send({
            status:"error",
            message:"No se ingresaron todos los datos requeridos."
        })
    }

    try {
        const [findUser,findWorker] = await Promise.all([
            UsersModel.findOne({"user_email":email,"user_state":"active"}),
            WorkerModel.findOne({"worker_email":email,"worker_state":"active"})
        ])

        const user = findUser || findWorker

        if (!user) {
            return res.status(404).send({
                status:"error",
                message:"El correo proporcionado no existe dentro de nuestra base de datos."
            })
        }

        if (!bcrypt.compareSync(password,user.user_password || user.worker_password)) {
            return res.status(400).send({
                status:"error",
                message:"Contraseña incorrecta."
            })
        }

        const objectUser = {
            id:findUser !== null ? findUser["_id"] : findWorker["_id"],
            name:findUser !== null ? findUser.user_name : findWorker.worker_name,
            last_name:findUser !== null ? findUser.user_last_name : findWorker.worker_last_name,
            role: findUser !== null ? 'usuario' : findWorker.worker_role
        }

        const token = jwt.sign(objectUser,process.env.SECRET,{
            expiresIn:'4h'
        })

        res.cookie('token', token, {
            httpOnly: true,         //Evita que sea accesible desde JS malicioso
            secure: true,        //DEBE SER FALSE CUANDO ES LOCAL, TRUE cuando se trabaja con https
            sameSite: 'none',     //LAX cuando el front y el back estan en el mismo dominio (local), NONE cuando no
            maxAge: 4 * 60 * 60 * 1000,
            path: '/',
        })
        
        return res.status(200).send({
            status: "completed",
            message: "Sesión iniciada correctamente."
        })
        
    } catch (error) {
        res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

/**
 * Cierra la sesión eliminando la cookie `token`.
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Estado de la operación.
 */
const LogOut = async(req,res) =>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        return res.status(200).send({
            status: 'completed'
        })

    } catch (error) {
       return res.status(500).send({
            status: 'error',
            message:"Error interno del servidor, por favor, intentelo más tarde."
       })
    }

}

/**
 * Verifica si hay un token válido en las cookies para saber si el usuario ha iniciado sesión.
 *
 * @param {Request} req - Objeto de solicitud con cookies.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Estado de la sesión (activo o inválido).
 */
const IsLoggedIn = async(req,res)=>{
    const token = req.cookies.token
    if (!token) {
        return res.status(401).send({
            status: 'error',
            message: 'No has iniciado sesión.',
        })
    }
    
    // Verificamos el token usando jwt
    jwt.verify(token,process.env.SECRET,(err)=>{
        if(err){
            return res.status(403).send({
                status:"error",
                message:"El token es inválido u ha expirado."
            })
        }

        return res.status(200).send()
    })
}

/**
 * Devuelve los datos del usuario decodificando el token presente en las cookies.
 *
 * @param {Request} req - Objeto de solicitud con cookie `token`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Información del usuario dentro del token.
 */
const SessionData = async(req,res)=>{
    const token = req.cookies.token
    try {
        const tokenDecoded = jwt.decode(token,process.env.SECRET)
        return res.status(200).send({
            status:"completed",
            data:tokenDecoded
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:"Ocurrió un error, por favor intentelo más tarde."
        })
    }
}

/**
 * Permite al usuario actualizar su contraseña si coincide la confirmación.
 *
 * @param {Request} req - Objeto de solicitud con `email`, `new_password` y `confirm_password`.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Response} - Estado de la operación (éxito o error).
 */
const RecoverPassword = async(req,res)=>{
    const {new_password,confirm_password,email} = req.body
    
    try {
        if (new_password !== confirm_password) {
            return res.status(409).send({
                status:"error",
                message:"Las contraseñas no coinciden."
            })
        }

        const [findUser,findWorker] = await Promise.all([
            UsersModel.findOne({"user_email":email,"user_state":"active"}),
            WorkerModel.findOne({"worker_email":email,"worker_state":"active"})
        ])
        
        if (!findUser && !findWorker) {
            return res.status(404).send({
                status:"error",
                message:"El correo proporcionado no existe dentro de nuestra base de datos."
            })
        }

        let data
        if (findUser) {
            data = {
                user_password:bcrypt.hashSync(new_password)
            }
        }else{
            data = {
                worker_password : bcrypt.hashSync(new_password)
            }
        }

        const update = findUser ? await UsersModel.findOneAndUpdate({"user_email":email},data) : await WorkerModel.findOneAndUpdate({"worker_email":email},data)

        if (!update) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el usuario."
            })
        }

        return res.status(200).send({
            status:"completed",
            message:"Contraseña actualizada correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}
/**
 * Exportación de métodos de sesión
 */
export const SessionMethods = {
    LogIn,
    LogOut,
    SessionData,
    IsLoggedIn,
    RecoverPassword
}