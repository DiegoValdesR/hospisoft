import { EmployeeModel } from "../../models/employees/employees.js"
import { Validations } from "../../validations/index.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const AllEmployees = async(req,res)=>{
    
    try {
        const employees = await EmployeeModel.find({"employee_state":"active"})
        return res.status(200).send({
            status:"completed",
            data:employees
        })

    } catch (error) {
        res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const EmployeeById = async(req,res)=>{
    const {id} = req.params
    
    try {
        const findOne = await EmployeeModel.findOne({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        })

        if (!findOne) {
            return res.status(404).send({
                status:"error",
                message: "No se encontró el empleado."
            })
        }
    
        return res.status(200).send({
            status:"completed",
            data: findOne
        })
    
    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

const InsertEmployee = async(req,res) =>{
    const data = {
        employee_name:req.body.employee_name,
        employee_last_name:req.body.employee_last_name,
        employee_birthdate:req.body.employee_birthdate,
        employee_email:req.body.employee_email,
        employee_password:req.body.employee_password,
        employee_phone_number:req.body.employee_phone_number,
        employee_role:req.body.employee_role,
        employee_speciality:req.body.employee_speciality
    }

    const errorDate = Validations.IsDateValid(data.employee_birthdate,"birthdate_employee")
    if (errorDate.length !== 0) {
        return res.status(400).send({
            status:"error",
            message:errorDate
        })
    }

    try {
        const emailExist = await EmployeeModel.findOne({
            "employee_email": data.employee_email
        })
        
        if (emailExist) {
            return res.status(409).send({
                status:"error",
                message: "El correo ingresado ya ha sido registrado por otro empleado."
            })
        }

        //si no ingresa nada o es null que coloque el default
        if (!data.employee_speciality || data.employee_speciality.length === 0) data.employee_speciality = "No aplica"
        //encriptamos la contraseña
        data.employee_password = bcrypt.hashSync(data.employee_password)
        const insert = new EmployeeModel(data)
        await insert.save()
        
        return res.status(201).send({
            status:"completed",
            message:"Empleado insertado!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }

}

const UpdateEmployee = async(req,res)=>{
    const {id} = req.params
    const data = {
        employee_name:req.body.employee_name,
        employee_last_name:req.body.employee_last_name,
        employee_email:req.body.employee_email,
        employee_phone_number:req.body.employee_phone_number,
        employee_role:req.body.employee_role,
        employee_speciality:req.body.employee_speciality
    }

    try {
        //si encuentra un registro que tenga el mismo email que el del body del request y no es el mismo id que el
        //del usuario retorna un objeto, sino null
        const findEmail = await EmployeeModel.findOne({
            "_id":{"$ne":mongoose.Types.ObjectId.createFromHexString(id)},
            "employee_email":data.employee_email
        })

       if (findEmail) {
            return res.status(409).send({
                status:"error",
                message:"Ese correo ya ha sido registrado por otro empleado."
            })
       }

       if (!data.employee_speciality || data.employee_speciality.length === 0) data.employee_speciality = "No aplica"

        await EmployeeModel.findOneAndUpdate({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
        },data)
        
        return res.status(200).send({
            status:"completed",
            message:"Empleado actualizado correctamente!",
        })
        
    } catch (error) {

        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }

}

const DeleteEmployee = async(req,res)=>{
    const {id} = req.params

    try {
        const deleteOne = await EmployeeModel.findOneAndUpdate({
            "_id":mongoose.Types.ObjectId.createFromHexString(id)
            },
            {"employee_state":"inactive"}
        )

        if (!deleteOne) {
            return res.status(404).send({
                status:"error",
                message:"No se encontró el empleado."
            })
        }
        
        return res.status(200).send({
            status:"completed",
            message:"Empleado eliminado correctamente!"
        })

    } catch (error) {
        return res.status(400).send({
            status:"error",
            message:error.toString()
        })
    }
}

export const EmployeesMethods = {
    AllEmployees,
    EmployeeById,
    InsertEmployee,
    UpdateEmployee,
    DeleteEmployee
}