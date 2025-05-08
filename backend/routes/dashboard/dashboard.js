import express from 'express'
const router = express.Router()

import { DashMethods } from '../../controllers/dashboard/dashboard.js'

router.get('/dash/all',DashMethods.GetItemsAndStock)

export default router