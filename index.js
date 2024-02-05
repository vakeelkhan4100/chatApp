const express = require("express")
const http = require("http")

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server);

// socket io
const users = {}
io.on("connection", Socket => {
    Socket.on("new-user-joined", name => {
        console.log("new-user", name, "line no 12")

        users[Socket.id] = name
        Socket.broadcast.emit("user-joined", name)
    })
    Socket.on("send", message => {
        Socket.broadcast.emit("receive", { message: message, name: users[Socket.id] })
    })
    Socket.on("disconnect", name => {
        Socket.broadcast.emit('left', users[Socket.id])
        delete users[Socket.id]
    })
})

app.use(express.static("./public"))

server.listen(8080, "localhost", () => {
    console.log(`server is start at port:8080`)
})