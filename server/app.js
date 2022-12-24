// Enable environment vaiables in dotenv file
import dotenv from 'dotenv'
dotenv.config()

// Import modules
import os from 'os'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'

// Configuration
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
// Enable JSON body parsing
app.use(express.json())
// Enable security middleware
app.use(helmet())
// Only permit same domain
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-origin' }))
// Enable body parsing for large payloads
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors())
// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
// Use morgan middleware to log HTTP requests
app.use(morgan((tokens, req, res) => {
    return [
        '[',
        tokens.date(req, res),
        ']',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['remote-addr'](req, res),
        tokens['referrer'](req, res)
    ].join(' ')
}, { stream: process.stdout }))

// Define File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

// Get current IP address
let ipAddr = ''
const interfaces = os.networkInterfaces();

// Iterate over the network interfaces
for (const ifname in interfaces) {
    // Get the current network interface
    const iface = interfaces[ifname];
    // Iterate over the addresses of the current network interface
    for (const addr of iface) {
        // Check if the address is an IPv4 address
        if (addr.family === 'IPv4') {
            // Print the IP address
            (addr.address === '127.0.0.1' || addr.address === '0.0.0.0') ?
                ipAddr = 'localhost' :
                ipAddr = addr.address
        }
    }
}

// Express server main
import indexRouter from './routes/indexRouter.js'
import authRouter from './routes/authRouter.js'
app.use('/', indexRouter)
app.use('/api/auth', authRouter)

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MongoDBUrl, { useNewUrlParser: true })
    .then(() => {
        const serverPort = process.env.SERVER_PORT || 8000
        app.listen(serverPort, () => {
            console.log(`Server listening on ${ipAddr}:${serverPort}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })