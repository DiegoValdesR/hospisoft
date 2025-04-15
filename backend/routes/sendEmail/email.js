import { SendEmail } from '../../controllers/sendEmails/emails.js'
import {Router} from 'express'

const router = Router()

router.post('/sendemail',SendEmail)

export default router
