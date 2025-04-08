import { DoctorSchema, DoctorsModel } from "../../models/doctor/doctor.js";
import bcrypt from "bcryptjs";
import { Validations } from "../../validations/all/validate.js";

const AllDoctors = async(req,res)=>{
    try {
        const doctors = await DoctorsModel.find()

        return res.status(200).send({
            data:doctors
        })

    } catch (error) {
        res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const DoctorById = async(req,res)=>{
    const {id} = req.params
    
        if (!id || id.length !== 24) {
            return res.status(400).send({
                message:"No se ha enviado el id o el enviado es incorrecto."
            })
        }

        if (!await Validations.IdExists(id,ItemsModel)) {
            return res.status(404).send({
                message:"No se pudo encontrar el médico."
            })
        }
    
        try {
            const findOne = await DoctorsModel.findOne({"_id":id})
    
            return res.status(200).send({
                data: findOne
            })
    
        } catch (error) {
            return res.status(500).send({
                message:"Error interno del servidor, por favor intentelo más tarde."
            })
        }
}

const InsertDoctor = async(req,res) =>{

    const {doctor_name,doctor_last_name,doctor_speciality,doctor_email,doctor_password,doctor_phone_number} = req.body

    const data ={
        doctor_name:doctor_name,
        doctor_last_name:doctor_last_name,
        doctor_speciality:doctor_speciality,
        doctor_email:doctor_email,
        doctor_password:doctor_password,
        doctor_phone_number:doctor_phone_number
    }

    const validation = Validations.IsObjectValid(DoctorSchema,data)

    if (validation.length !== 0) {
        return res.status(400).send({
            message:validation
        })
    }

    try {
        const doctorExists = await DoctorsModel.findOne({ doctor_email: data.doctor_email });
        
        if (doctorExists) {
            return res.status(409).send({
                message: "El correo ingresado ya ha sido registrado por otro médico."
            })
        }

        //encriptamos la contraseña
        data.doctor_password = bcrypt.hashSync(data.doctor_password)
        const insert = new DoctorsModel(data)
        await insert.save()
        
        return res.status(201).send({
            message:"Médico insertado!"
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }

}

const UpdateDoctor = async(req,res)=>{
    const {id} = req.params

    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id, o el enviado es incorrecto."
        })
    }

    //Validaciones del modulo validate
    if (!await Validations.IdExists(id,DoctorsModel)) {
        return res.status(404).send({
            message:"No se pudo encontrar el médico."
        })
    }

    const {doctor_name,doctor_last_name,doctor_speciality,
        doctor_email,doctor_phone_number
    } = req.body

    const data = {
        doctor_name : doctor_name,
        doctor_last_name : doctor_last_name,
        doctor_speciality : doctor_speciality,
        doctor_email : doctor_email,
        doctor_phone_number : doctor_phone_number
    }

    const validation = Validations.IsObjectValid(DoctorSchema,data)
    if (validation.length !== 0) {
        return res.status(400).send({
            message:validation
        })
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
       const findEmail = await DoctorsModel.findOne({"_id":{"$ne":id},"doctor_email":data.doctor_email})

       if (findEmail) {
            return res.status(409).send({
                message:"Ese correo ya ha sido registrado por otro médico."
            })
       }

        await DoctorsModel.findOneAndUpdate({"_id":id},data)
        
        return res.status(200).send({
            message:"Médico actualizado correctamente!",
        })
        
    } catch (error) {

        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }

}

const DeleteDoctor = async(req,res)=>{
    const {id} = req.params
    
    if (!id || id.length !== 24) {
        return res.status(400).send({
            message:"No se envío el id o el enviado es incorrecto."
        })
    }

    if (!Validations.IdExists(id)) {
        return res.status(404).send({
            message:"No se pudo encontrar el médico."
        })
    }

    try {
        await DoctorsModel.findOneAndDelete({"_id":id})
        
        return res.status(200).send({
            message:"Médico eliminado correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            message:"Error interno del servidor, por favor intentelo más tarde"
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