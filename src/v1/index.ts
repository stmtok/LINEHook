import express, { ErrorRequestHandler } from 'express'
import debug from 'debug'
import { Client, middleware } from '@line/bot-sdk'
const debugServer = debug('server')
const v1 = express()
const channelSecret = process.env.CHANNEL_SECRET || "mock"
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN || "mock"
const lineMiddleware = middleware({ channelSecret })
// const botClient = new Client({ channelAccessToken })

v1.get('/', (req, res, next) => {
    debugServer(req.body)
    res.send({ text: "Hello World!" })
})

v1.post('/webhook', lineMiddleware, (req, res, next) => {
    debugServer(req.body)
    res.send({ code: "ok" })
})
// const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//     debugServer(err)
//     res.status(500).send(err.message)
// }

// v1.use(errorHandler)

export default v1