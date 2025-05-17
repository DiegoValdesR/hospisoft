import { UsersModel } from "../../models/user/user.js"
import { WorkerModel } from "../../models/workers/workers.js"
import { TokensModel } from "../../models/tokens/tokens.js"
import {config} from 'dotenv'
config()

const GenToken = async(req,res)=>{
    const {email} = req.body

    try {
        const [user,worker] = await Promise.all([
            UsersModel.findOne({"user_email":email,"user_state":"active"},'user_email'),
            WorkerModel.findOne({"worker_email":email,"worker_state":"active"},'worker_email')
        ])

        if (!user && !worker) {
            return res.status(404).send({
                status:"error",
                message:"El correo ingresado es incorrecto."
            })
        }
        
        const token = Math.round(10000 + Math.random() * 900000)
        
        const data = {
            token:token,
            user_id: user ? user["_id"] : worker["_id"]
        }
        const insert = new TokensModel(data)
        await insert.save()

        await fetch(process.env.API_URL + '/sendemail',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                to:user ? user.user_email : worker.worker_email,
                subject:"Verificar identidad",
                html:`<!DOCTYPE html>
                        <html lang="es">
                        <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>Recuperación de Contraseña</title>
                        <style>
                            body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f7;
                            padding: 20px;
                            color: #333;
                            }

                            .container {
                            max-width: 500px;
                            margin: auto;
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                            }

                            h2 {
                            color: #2e7dff;
                            }

                            .code-box {
                            font-size: 32px;
                            font-weight: bold;
                            background-color: #f0f4ff;
                            color: #2e7dff;
                            padding: 15px;
                            text-align: center;
                            border-radius: 8px;
                            letter-spacing: 8px;
                            margin: 20px 0;
                            }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h2>Recuperación de contraseña</h2>
                            <p>Hola,</p>
                            <p>Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código para continuar con el proceso:</p>

                            <div class="code-box">${token}</div>

                            <p>Este código es válido por 3 minutos.</p>
                            <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje.</p>

                        </div>
                        </body>
                </html>`
            })
        })
        
        return res.status(201).send({
            status:"completed"
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde"
        })
    }
}

const ValidateToken = async(req,res)=>{
    const {token} = req.body
    try {
        const findOne = await TokensModel.findOne({"token":token,"used":false})
        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message:"Código equivocado"
            })
        }

        return res.status(200).send({
            status:"completed",
            message:"Código verificado!"
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde"
        })
    }
}

export const TokensMethods = {
    GenToken
}