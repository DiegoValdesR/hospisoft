import express from 'express'
const router = express.Router()
import { DetailsMethods } from '../../controllers/detailsFormula/details.js'

router.get('/details/all',DetailsMethods.AllFormulas)
router.post('/details/new',DetailsMethods.InsertFormula)
export default router
