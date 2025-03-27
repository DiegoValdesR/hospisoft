import cors from 'cors'
import express, { json } from 'express'
import { connect } from "./controllers/bd/bd.js"
const app = express()
const serverPort = process.env.DB_PORT

app.use(cors())
app.use(json())

//llamamos al metodo que ejecuta la conexion con la base de datos
connect()
//RUTAS
//


app.listen(serverPort,()=>{
    console.log("Server running in: "+serverPort);
    
})

