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

const DoctorById = async(req,res)=>{
    const {id} = req.params
    
        if (!id) {
            return res.status(400).send({
                message:"No se ha enviado el id"
            })
        }
    
        try {
            const findOne = await DoctorsModel.findOne({"_id":id})
    
            return res.status(200).send({
                data: findOne
            })
    
        } catch (error) {
            return res.status(404).send({
                message:"No se encontró algún usuario con el id provicionado"
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

    for (const key in data) {
        if (data[key] === "") {
            return res.status(400).send({
                message:"Faltan datos"
            })
        }
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

const UpdateDoctor = async(req,res)=>{
    const id = req.params.id

    const data = {
        doctor_name : req.body.doctor_name,
        doctor_last_name : req.body.doctor_last_name,
        doctor_speciality : req.body.doctor_speciality,
        doctor_email : req.body.doctor_email,
        doctor_phone_number: req.body.doctor_phone_number
    }

    for (const key in data) {
        if (data[key] === "") {
            return res.status(400).send({
                message:"Faltan datos"
            })
        }
    }

    if (!id) {
        return res.status(400).send({
            message:"No se envío el id del usuario"
        })
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
       const findEmail = await DoctorsModel.findOne({"_id":{"$ne":id},"doctor_email":data.doctor_email})

       if (findEmail) {
            return res.status(409).send({
                message:"Ese correo ya ha sido registrado por otro usuario"
            })
       }

        await DoctorsModel.findOneAndUpdate({"_id":id},{
            doctor_name:data.doctor_name,
            doctor_last_name : data.doctor_last_name,
            doctor_speciality : data.doctor_speciality,
            doctor_email : data.doctor_email,
            doctor_phone_number: data.doctor_phone_number
        })
        
       return res.status(200).send({
        message:"Usuario actualizado correctamente!",
       })
        
        
    } catch (error) {

        return res.status(400).send({
            message:"No se pudo actualizar el usuario, por favor intentelo más tarde"
        })
    }

}

const DeleteDoctor = async(req,res)=>{
    const {id} = req.params
    if (!id) {
        return res.status(400).send({
            message:"No se envío el id"
        })
    }

    try {
        const deleteDoctor = await DoctorsModel.findOneAndDelete({"_id":id})
        if (!deleteDoctor) {
            return res.status(404).send({
                message:"No se pudo encontrar el registro a eliminar"
            })
        }

        return res.status(200).send({
            message:"Registro eliminado correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error del servidor, por favor intentelo más tarde"
        })
    }
}

export const DoctorMethods = {
    AllDoctors,
    DoctorById,
    InsertDoctor,
    UpdateDoctor,
    DeleteDoctor
}