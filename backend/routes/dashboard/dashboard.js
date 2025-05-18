import express from 'express'
const router = express.Router()

import { DashMethods } from '../../controllers/dashboard/dashboard.js'


router.get('/dash/all',DashMethods.GetItemsAndStock)
router.get('/dash/facture',DashMethods.GetMonthlyBilling)
router.get('/dash/doctors',DashMethods.GetDoctorsWithMostAppointments)
router.get('/dash/patients',DashMethods.GetMonthlyPatients)

export default router