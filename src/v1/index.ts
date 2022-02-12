import express from 'express'
import debug from 'debug'
import mysql from 'mysql'
import { Client, middleware, WebhookRequestBody, WebhookEvent, Message } from '@line/bot-sdk'
const debugServer = debug('server')
const debugDB = debug('db')
const v1 = express()
const channelSecret = process.env.CHANNEL_SECRET || "mock"
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN || "mock"
const lineMiddleware = middleware({ channelSecret })
const botClient = new Client({ channelAccessToken })
const sql = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'line'
})

sql.connect((err) => {
    if (err) {
        debugDB(err.message)
    } else {
        debugDB('connection ok')
    }
})

v1.get('/', (req, res, next) => {
    debugServer(req.url)
    res.send({ version: "1" })
})

v1.post('/webhook', lineMiddleware, (req, res, next) => {
    const body: WebhookRequestBody = req.body
    debugServer(JSON.stringify(body))
    // イベントを保存
    sql.query('INSERT INTO events SET ?', { data: JSON.stringify(body) }, (error, response) => {
        if (error) {
            debugDB("insert event:" + error.message)
        } else {
            debugDB("insert event:" + JSON.stringify(response))
        }
    })
    body.events.forEach((event: WebhookEvent) => {
        switch (event.type) {
            case "follow":
                if (event.source.type === "user") {
                    // フォローイベント時にユーザを保存
                    sql.query('INSERT IGNORE INTO users SET ?', { uid: event.source.userId }, (error, response) => {
                        if (error) {
                            debugDB("insert user:" + error.message)
                        } else {
                            debugDB("insert user:" + JSON.stringify(response))
                        }
                    })
                }
                break
            case "unfollow":
                // アンフォロー時にユーザを削除
                if (event.source.type === "user") {
                    sql.query('DELETE FROM users WHERE uid=?', event.source.userId, (error, response) => {
                        if (error) {
                            debugDB("delete user:" + error.message)
                        } else {
                            debugDB("delete user:" + JSON.stringify(response))
                        }
                    })
                }
                break
            case "message":
                const reply: Message = {
                    type: "text",
                    text: "受け取りました。"
                }
                botClient.replyMessage(event.replyToken, reply)
                    .then((response) => {
                        debugServer("reply: " + JSON.stringify(response))
                    }).catch((error) => {
                        debugServer("reply: " + JSON.stringify(error))
                    })
                break
            case "postback":
                break
        }
    })
    res.send({ code: "ok" })
})

export default v1