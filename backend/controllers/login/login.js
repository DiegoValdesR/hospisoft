import { UsersModel } from "../../models/user/user.js"
import { EmployeeModel } from "../../models/employees/employees.js"
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
        const [findUser,findEmployee] = await Promise.all([
            UsersModel.findOne({"user_email":email,"user_state":"active"}),
            EmployeeModel.findOne({"employee_email":email,"employee_state":"active"})
        ])

        const user = findUser || findEmployee

        if (!user) {
            return res.status(404).send({
                status:"error",
                message:"El correo proporcionado no existe dentro de nuestra base de datos."
            })
        }

        if (!bcrypt.compareSync(password,user.user_password || user.employee_password)) {
            return res.status(400).send({
                status:"error",
                message:"Contraseña incorrecta."
            })
        }

        const objectUser = {
            id:findUser !== null ? findUser._id : findEmployee._id,
            name:findUser !== null ? findUser.user_name : findEmployee.employee_name,
            last_name:findUser !== null ? findUser.user_last_name : findEmployee.employee_last_name,
            email:findUser !== null ? findUser.user_email : findEmployee.employee_email,
            role: findUser !== null ? 'usuario' : findEmployee.employee_role
        }

        const token = jwt.sign(objectUser,process.env.SECRET,{
            expiresIn:'1h'
        })

        return res.status(200).send({
            status:"completed",
            message:"Sesión iniciada correctamente.",
            token:token
        })
        
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