import express from 'express'
import { FormulaMethods } from '../../controllers/formula/formula.js'
const router = express.Router()
router.get('/formulas/all',FormulaMethods.AllFormulas)
router.get('/formulas/byid/:id',FormulaMethods.FormulaById)
router.post('/formulas/insert',FormulaMethods.InsertFormula)
router.patch('/formulas/delete/:id',FormulaMethods.DeleteFormula)

export default router

