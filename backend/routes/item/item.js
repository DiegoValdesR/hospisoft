import express from 'express'
const router = express.Router()

import { ItemsMethods } from '../../controllers/item/item.js'

router.get('/items/all',ItemsMethods.GetItems)
router.get('/items/byid/:id',ItemsMethods.GetItemById)
router.post('/items/insert',ItemsMethods.InsertItem)
router.put('/items/update/:id',ItemsMethods.UpdateItem)
router.delete('/items/delete/:id',ItemsMethods.DeleteItem)

export default router