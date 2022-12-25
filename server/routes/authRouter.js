import { Router } from "express"
const authRouter = Router()

import { register } from '../controllers/auth.js'

authRouter.route('/register').post(register)

export default authRouter