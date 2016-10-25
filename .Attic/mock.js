const { Server } = require("ws"),
    { readFileSync } = require("fs"),
    PORT = 9696

const wss = new Server({ port: PORT })
let conn = -1
wss.on("connection", ws => {
    conn++
    let stage = -1,
        path = `${__dirname}/../tmp/${Math.random().toString(36).slice(2)}.tmp`,
        token = Math.random().toString(36).slice(2)
    ws.on("message", message => {
        stage++
        const data = JSON.parse(message)
        console.log(`<= #${conn}:${stage}:(${data.messageId}): ${message}`)
        if (data.action == "request-external-authorization" && stage == 0) {
            send(ws, {
                action: "external-authorization-response",
                payload: {
                    file: path,
                    token
                }
            })
        } else if (data.action == "request-authorization" && stage == 1) {
            send(ws, {
                action: "authorization-response",
                payload: {
                    success: checkFile(path, token)
                }
            })
        } else {
            data.correlationId = data.messageId
            delete data.messageId
            send(ws, data)
        }
    })
})

function checkFile(path, token) {
    const stored = readFileSync(path, { encoding: "utf8" }),
        ok = stored == token
    console.log(`++ Token check: ${ok}`) 
    return ok
    //throw new Error("Token mismatch")
}

function send(ws, data) {
    ws.send(JSON.stringify(data), { binary: false })
}