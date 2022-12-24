import { Router } from "express"
const authRouter = Router()

import { register } from '../controllers/auth.js'

authRouter.route('/register')
    .get((req, res) => {
        return res.json({ test: 'test' })
    })
    .post((req, res) => {
        register()
    })

export default authRouter