import nodemailer from 'nodemailer'
import {config} from 'dotenv'
config()

const {MAILER_EMAIL,MAILER_PASSWORD} = process.env

/**
 * Configuración del transporte de correo usando Gmail y Nodemailer.
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service:"gmail",
    auth:{
        user:MAILER_EMAIL,
        pass:MAILER_PASSWORD
    }
})

/**
 * Envía un correo electrónico usando Nodemailer.
 *
 * @param {Request} req - Objeto de solicitud HTTP con los datos del correo en el cuerpo.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Object} JSON con el estado de la operación y un mensaje de éxito o error.
 */
export const SendEmail = async(req,res)=>{

    const mailOptions = {
        to:req.body.to,
        subject:req.body.subject,
        text:req.body.text,
        attatchments:req.body.attatchments,
        html:req.body.html
    }

    mailOptions.from = MAILER_EMAIL

    try {
        await transporter.sendMail(mailOptions)
        
        return res.status(201).send({
            status:"completed",
            message:"Email enviado!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

