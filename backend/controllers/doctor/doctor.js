import { DoctorSchema, DoctorsModel } from "../../models/doctor/doctor.js";
import { Validations } from "../../validations/index.js";
import bcrypt from "bcryptjs";

const AllDoctors = async(req,res)=>{
    try {
        const doctors = await DoctorsModel.find({"doctor_state":"active"})
        return res.status(200).send({
            status:"completed",
            data:doctors
        })

    } catch (error) {
        res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const DoctorById = async(req,res)=>{
    const {id} = req.params

        if (!await Validations.IsIdValid(id,DoctorsModel)) {
            return res.status(404).send({
                status:"error",
                message:"No se pudo encontrar el médico asociado con ese id."
            })
        }
    
        try {
            const findOne = await DoctorsModel.findOne({"_id":id})
    
            return res.status(200).send({
                status:"completed",
                data: findOne
            })
    
        } catch (error) {
            return res.status(500).send({
                status:"error",
                message:"Error interno del servidor, por favor intentelo más tarde."
            })
        }
}

const InsertDoctor = async(req,res) =>{
    const data = {
        doctor_name:req.body.doctor_name,
        doctor_last_name:req.body.doctor_last_name,
        doctor_speciality:req.body.doctor_speciality,
        doctor_email:req.body.doctor_email,
        doctor_password:req.body.doctor_password,
        doctor_phone_number:req.body.doctor_phone_number
    }

    const objectErrors = await Validations.IsRequestValid(DoctorSchema,DoctorsModel,data)

    if (objectErrors.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:objectErrors
        })
    }

    try {
        const doctorExists = await DoctorsModel.findOne({ doctor_email: data.doctor_email });
        
        if (doctorExists) {
            return res.status(409).send({
                status:"error",
                message: "El correo ingresado ya ha sido registrado por otro médico."
            })
        }

        //encriptamos la contraseña
        data.doctor_password = bcrypt.hashSync(data.doctor_password)
        const insert = new DoctorsModel(data)
        await insert.save()
        
        return res.status(201).send({
            status:"completed",
            message:"Médico insertado!"
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }

}

const UpdateDoctor = async(req,res)=>{
    const {id} = req.params
    const data = {
        doctor_name:req.body.doctor_name,
        doctor_last_name:req.body.doctor_last_name,
        doctor_speciality:req.body.doctor_speciality,
        doctor_email:req.body.doctor_email,
        doctor_phone_number:req.body.doctor_phone_number
    }

    if (!await Validations.IsIdValid(id,DoctorsModel)) {
        return res.status(404).send({
            status:"error",
            message:"No se pudo encontrar el médico asociado a ese id."
        })
    }

    const objectErrors = await Validations.IsRequestValid(DoctorSchema,DoctorsModel,data)
    if (objectErrors.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:objectErrors
        })
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
       const findEmail = await DoctorsModel.findOne({"_id":{"$ne":id},"doctor_email":data.doctor_email})

       if (findEmail) {
            return res.status(409).send({
                status:"error",
                message:"Ese correo ya ha sido registrado por otro médico."
            })
       }

        await DoctorsModel.findOneAndUpdate({"_id":id},data)
        
        return res.status(200).send({
            status:"completed",
            message:"Médico actualizado correctamente!",
        })
        
    } catch (error) {

        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }

}

const DeleteDoctor = async(req,res)=>{
    const {id} = req.params

    if (!await Validations.IsIdValid(id,DoctorsModel)) {
        return res.status(404).send({
            status:"error",
            message:"No se pudo encontrar el médico asociado a ese id."
        })
    }

    try {
        await DoctorsModel.findOneAndUpdate({"_id":id},{"doctor_state":"inactive"})
        
        return res.status(200).send({
            status:"completed",
            message:"Médico eliminado correctamente!"
        })

    } catch (error) {
        return res.status(500).send({
            status:"error",
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