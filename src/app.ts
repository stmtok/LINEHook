import express from 'express'
import debug from 'debug'
const debugServer = debug('server')
const app = express()

app.use(express.json)
app.use(express.urlencoded({
    extended: true
}))
app.get('/', (req, res, next) => {
    debugServer(req.body)
    res.send({ text: "Hello World!" })
})

export default app