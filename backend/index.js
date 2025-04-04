import cors from 'cors'
import express, { json } from 'express'
import { MongoDbConnection } from './db/db.js'

const app = express()
const serverPort = process.env.DB_PORT

app.use(cors())
app.use(json())

//llamamos al metodo que ejecuta la conexion con la base de datos
MongoDbConnection()
//RUTAS
import UserRoutes from './routes/user/user.js'
import DoctorRoutes from './routes/doctor/doctor.js'

app.use('/api',UserRoutes)
app.use('/api',DoctorRoutes)

//FIN RUTAS
app.listen(serverPort)
