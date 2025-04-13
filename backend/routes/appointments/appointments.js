import express from 'express'
import { AppointmentsMethods } from '../../controllers/appointments/appointments.js'

const router = express.Router()

router.get('/appointments/all',AppointmentsMethods.AllApointments)
router.get('/appointments/byid/:id',AppointmentsMethods.AppointmentById)
router.post('/appointments/insert/',AppointmentsMethods.InsertAppointment)
router.patch('/appointments/deactivate/:id',AppointmentsMethods.DeactivateAppointment)

export default router