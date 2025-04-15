import nodemailer from 'nodemailer'
import {config} from 'dotenv'
config()

const {MAILER_EMAIL,MAILER_PASSWORD} = process.env

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

export const SendEmail = async(req,res)=>{

    const mailOptions = {
        to:req.body.to,
        subject:req.body.subject,
        text:req.body.text
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

