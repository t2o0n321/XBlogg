import { Router } from "express"
const indexRouter = Router()

indexRouter.route('/')
    .get((req, res) => {
        return res.json({ status: 200 })
    })

export default indexRouter