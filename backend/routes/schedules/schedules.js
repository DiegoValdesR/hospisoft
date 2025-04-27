import { ScheduleMethods } from "../../controllers/schedule/schedule.js"
import express from 'express'
const router = express.Router()

router.get('/schedules/all',ScheduleMethods.AllSchedules)
router.get('/schedules/byworker/:id',ScheduleMethods.ScheduleByWorker)
router.post('/schedules/new',ScheduleMethods.InsertSchedule)
router.put('/schedules/update/:id',ScheduleMethods.UpdateSchedule)
router.patch('/schedules/deactivate/:id',ScheduleMethods.DeactivateSchedule)


export default router