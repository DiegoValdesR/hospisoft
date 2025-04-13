import express from 'express'
const router = express.Router()
import { DetailsMethods } from '../../controllers/detailsFormula/details.js'

router.get('/details/all',DetailsMethods.AllFormulas)
router.get('/details/byid/:id',DetailsMethods.FormulaById)
router.post('/details/new',DetailsMethods.InsertFormula)
router.patch('/details/delete/:id',DetailsMethods.DeleteFormula)

export default router
