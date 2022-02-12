import express from 'express'
import debug from 'debug'
import { Client, middleware } from '@line/bot-sdk'
const debugServer = debug('server')
const v1 = express()
const channelSecret = process.env.CHANNEL_SECRET || "mock"
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN || "mock"
const lineMiddleware = middleware({ channelSecret })
const botClient = new Client({ channelAccessToken })

v1.get('/', (req, res, next) => {
    debugServer(req.url)
    res.send({ version: "1" })
})

v1.post('/webhook', lineMiddleware, (req, res, next) => {
    debugServer(JSON.stringify(req.body))
    res.send({ code: "ok" })
})

export default v1