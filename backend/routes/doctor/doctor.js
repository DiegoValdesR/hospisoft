import express from 'express'
const router = express.Router()
import { DoctorMethods } from '../../controllers/doctor/doctor.js'

router.get('/doctors/all',DoctorMethods.AllDoctors)
router.post('/doctors/new',DoctorMethods.InsertDoctor)

export default router