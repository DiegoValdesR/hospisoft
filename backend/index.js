import cors from 'cors'
import express, { json } from 'express'
import { config } from 'dotenv';
config()

// Galletas Free <------------------------------- <------------------------ <------------------------
import cookieParser from 'cookie-parser';
import { MongoDbConnection } from './db/db.js'
const app = express()
const serverPort = process.env.DB_PORT

app.use(cors({
    origin: ["http://localhost:5173",process.env.API_URL],
    credentials: true
}))
app.use(json())
app.use(cookieParser());

//llamamos al metodo que ejecuta la conexion con la base de datos
MongoDbConnection()

//RUTAS
import UserRoutes from './routes/user/user.js'
import WorkersRoutes from './routes/workers/workers.js'
import ItemsRoutes from './routes/item/item.js'
import FormulaRoutes from './routes/formula/formula.js'
import AppointmentsRoutes from './routes/appointments/appointments.js'
import SchedulesRoutes from './routes/schedules/schedules.js'
import MedicalRoutes from './routes/medical_history/medical_history.js'
import SessionRoutes from './routes/session/session.js'
import EmailRoutes from './routes/sendEmail/email.js'
import DashRoutes from './routes/dashboard/dashboard.js'
import TokenRoutes from './routes/tokens/tokens.js'
import { AuthorizationToken } from './middleware/auth.js'

app.use('/api',SessionRoutes)
app.use('/api',EmailRoutes)
app.use('/api',UserRoutes)
app.use('/api',TokenRoutes)

//auth es el middleware que verifica que haya iniciado sesión (revisar middleware para entender)
app.use(AuthorizationToken)

//cada metodo desde aqui usa el middleware
app.use('/api',DashRoutes)
app.use('/api',WorkersRoutes)
app.use('/api',ItemsRoutes)
app.use('/api',FormulaRoutes)
app.use('/api',AppointmentsRoutes)
app.use('/api',SchedulesRoutes)
app.use('/api',MedicalRoutes)

app.listen(serverPort)
