import express from 'express'
const router = express.Router()
import { DoctorMethods } from '../../controllers/doctor/doctor.js'

router.get('/doctors/all',DoctorMethods.AllDoctors)
router.get('/doctors/byid/:id',DoctorMethods.DoctorById)
router.post('/doctors/new',DoctorMethods.InsertDoctor)
router.put('/doctors/update/:id',DoctorMethods.UpdateDoctor)
router.delete('/doctors/delete/:id',DoctorMethods.DeleteDoctor)

export default router