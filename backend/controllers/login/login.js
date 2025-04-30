import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { config } from "dotenv"
config()

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
            id:findUser !== null ? findUser._id : findWorker._id,
            name:findUser !== null ? findUser.user_name : findWorker.worker_name,
            last_name:findUser !== null ? findUser.user_last_name : findWorker.worker_last_name,
            email:findUser !== null ? findUser.user_email : findWorker.worker_email,
            role: findUser !== null ? 'usuario' : findWorker.worker_role
        }

        const token = jwt.sign(objectUser,process.env.SECRET,{
            expiresIn:'4h'
        })

        res.cookie('token', token, {
            httpOnly: true,         //Evita que sea accesible desde JS malicioso
            secure: false,        //DEBE SER FALSE CUANDO ES LOCAL, TRUE cuando se trabaja con https
            sameSite: 'Lax',     //LAX cuando el front y el back estan en el mismo dominio (local), NONE cuando no
            maxAge: 4 * 60 * 60 * 1000
        });
        
        return res.status(200).send({
            status: "completed",
            message: "Sesión iniciada correctamente."
        });
        
    } catch (error) {
        res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

export const LogInMethods = {
    LogIn
}