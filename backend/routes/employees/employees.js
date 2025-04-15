import express from 'express'
const router = express.Router()
import { EmployeesMethods } from '../../controllers/employees/employees.js'

router.get('/employees/all',EmployeesMethods.AllEmployees)
router.get('/employees/byid/:id',EmployeesMethods.EmployeeById)
router.post('/employees/new',EmployeesMethods.InsertEmployee)
router.put('/employees/update/:id',EmployeesMethods.UpdateEmployee)
router.patch('/employees/delete/:id',EmployeesMethods.DeleteEmployee)

export default router