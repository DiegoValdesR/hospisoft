import mysql from 'mysql2'
import  {config} from 'dotenv';

//destructuring al dotenv y extraemos el metodo que nos permite cargar las variables de entorno
config()

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export const connect = () =>{
    conexion.connect((error)=>{
        if (error) {
            console.error(`Error en la conexion de la base de datos: \n ${error}`) 
        }
    })
}

