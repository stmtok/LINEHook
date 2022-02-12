import express from 'express'
import v1 from './v1'
const prefix = process.env.PATH_PREFIX || ""
const app = express()

app.use(prefix + '/v1', v1)

export default app