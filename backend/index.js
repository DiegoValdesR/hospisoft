import cors from 'cors'
import express, { json } from 'express'
import { MongoDbConnection } from './db/db.js'
import { AuthorizationToken as auth } from './middleware/auth.js'
const app = express()
const serverPort = process.env.DB_PORT

app.use(cors())
app.use(json())

//llamamos al metodo que ejecuta la conexion con la base de datos
MongoDbConnection()

//RUTAS
import UserRoutes from './routes/user/user.js'
import EmployeesRoutes from './routes/employees/employees.js'
import ItemsRoutes from './routes/item/item.js'
import DetailsRoutes from './routes/detailsFormula/details.js'
import FormulaRoutes from './routes/formula/formula.js'
import AppointmentsRoutes from './routes/appointments/appointments.js'
import SchedulesRoutes from './routes/schedules/schedules.js'
import MedicalRoutes from './routes/medical_history/medical_history.js'
import LogInRoutes from './routes/login/login.js'
import EmailRoutes from './routes/sendEmail/email.js'

app.use('/api',LogInRoutes)
app.use('/api',EmailRoutes)

//auth es el middleware que verifica que haya iniciado sesión (revisar middleware para entender)
//app.use(auth)

//cada metodo desde aqui usa el middleware
app.use('/api',UserRoutes)
app.use('/api',EmployeesRoutes)
app.use('/api',ItemsRoutes)
app.use('/api',DetailsRoutes)
app.use('/api',FormulaRoutes)
app.use('/api',AppointmentsRoutes)
app.use('/api',SchedulesRoutes)
app.use('/api',MedicalRoutes)

app.listen(serverPort)
