import { TokensMethods } from '../../controllers/tokens/tokens.js'
import {Router} from 'express'
const router = Router()

router.post('/tokens/new',TokensMethods.GenToken)
router.post('/tokens/validate',TokensMethods.ValidateToken)

export default router
