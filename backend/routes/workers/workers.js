import express from 'express'
const router = express.Router()
import { WorkersMethods } from '../../controllers/workers/workers.js'

router.get('/workers/all',WorkersMethods.AllWorkers)
router.get('/workers/alldoctors',WorkersMethods.AllDoctors)
router.get('/workers/byid/:id',WorkersMethods.WorkerById)
router.post('/workers/new',WorkersMethods.InsertWorker)
router.put('/workers/update/:id',WorkersMethods.UpdateWorker)
router.patch('/workers/delete/:id',WorkersMethods.DeleteWorker)

export default router