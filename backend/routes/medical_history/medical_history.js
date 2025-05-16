import { MedicalMethods } from "../../controllers/medical_history/medical_history.js";
import express from 'express'
const router = express.Router()

router.get('/medical_history/all',MedicalMethods.AllMedicalHistory)
router.get('/medical_history/byid/:id',MedicalMethods.MedicalHistoryById)
router.post('/medical_history/new',MedicalMethods.InsertMedicalHistory)

export default router