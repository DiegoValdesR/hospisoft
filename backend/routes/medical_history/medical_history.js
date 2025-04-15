import { MedicalMethods } from "../../controllers/medical_history/medical_history.js";
import express from 'express'
const router = express.Router()

router.get('/medical_history/all',MedicalMethods.AllMedicalHistory)
router.get('/medical_history/bypatient/:id',MedicalMethods.MedicalHistoryByPatient)
router.post('/medical_history/new',MedicalMethods.InsertMedicalHistory)
router.put('/medical_history/update/:id',MedicalMethods.UpdateMedicalHistory)
router.patch('/medical_history/deactivate/:id',MedicalMethods.DeactivateMedicalHistory)

export default router