import { DoctorsModel } from "../../models/doctor/doctor.js";
import bcrypt from "bcryptjs";

const AllDoctors = async(req,res)=>{
    try {
        const doctors = await DoctorsModel.find()

        return res.status(200).send({
            data:doctors
        })

    } catch (error) {
        res.status(500).send({
            message:"Error del servidor, por favor intentelo de nuevo"
        })
    }
}

const InsertDoctor = async(req,res) =>{
    const data = {
        doctor_name : req.body.doctor_name,
        doctor_last_name : req.body.doctor_last_name,
        doctor_speciality : req.body.doctor_speciality,
        doctor_email : req.body.doctor_email,
        doctor_password : bcrypt.hashSync(req.body.doctor_password), //encriptar contraseña antes de guardarla
        doctor_phone_number: req.body.doctor_phone_number
    }

    try {
        const doctorExists = await DoctorsModel.findOne({ doctor_email: data.doctor_email });
        
        if (doctorExists) {
            return res.status(409).send({
                message: "El correo ingresado ya existe"
            })
        }

        const insert = new DoctorsModel(data)
        await insert.save()
    
        return res.status(201).send({
            message:"Doctor insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            message:error
        })
    }

}

export const DoctorMethods = {
    AllDoctors,
    InsertDoctor
}