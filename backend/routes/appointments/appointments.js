import express from 'express'
import { AppointmentsMethods } from '../../controllers/appointments/appointments.js'

const router = express.Router()

router.get('/appointments/all',AppointmentsMethods.AllApointments)
router.get('/appointments/byid/:id',AppointmentsMethods.AppointmentById)
router.post('/appointments/new',AppointmentsMethods.InsertAppointment)
router.put('/appointments/update/:id',AppointmentsMethods.UpdateAppointment)
router.patch('/appointments/deactivate/:id',AppointmentsMethods.DeactivateAppointment)

export default router