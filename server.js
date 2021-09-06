const express = require("express");
const app = express();
const server = require("http").Server(app)
const io = require("socket.io")(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const {v4: uuidV4} = require("uuid");

app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.use(express.static("public"))

app.get("/gallery", (req, res) => {
    res.render('gallery')
})

app.get('/', function (req, res) {
    res.redirect(`/${uuidV4()}`)
});

app.get("/:room", (req, res) => {
    res.render('index', {roomId: req.params.room})
})

let numusers = 0;

io.on("connection", function(socket){

    socket.on('join-room', (roomId, userId) => {
        ++numusers
        // allowing current socket to join the room
        socket.join(roomId)
        // sending message to the other users in the room, current user is connected to
        socket.to(roomId).broadcast.emit('user-connected', {userId, numusers})

        socket.on("pencilSpecs", function(pencilSpecsObj) {
            socket.to(roomId).broadcast.emit("onPencilSpecs", pencilSpecsObj);
        });

        socket.on("eraserSpecs", function(eraserSpecsObj) {
            socket.to(roomId).broadcast.emit("onEraserSpecs", eraserSpecsObj);
        });

        socket.on("handleToolChange", function(tool){
            socket.to(roomId).broadcast.emit("onToolChange", tool)
        })

        socket.on("hamburger", function(){
            socket.to(roomId).broadcast.emit("onhamburger");
        })

        socket.on("mousedown", function(pointObj){
            socket.to(roomId).broadcast.emit("onmousedown", pointObj);
        })

        socket.on("mouseup", function(pointObj){
            socket.to(roomId).broadcast.emit("onmouseup", pointObj);
        })

        socket.on("undo", function(){
            socket.to(roomId).broadcast.emit("onundo");
        })

        socket.on("redo", function(){
            socket.to(roomId).broadcast.emit("onredo");
        })

        socket.on("show count", (data) => {
            socket.to(roomId).broadcast.emit("show count", data);
        })

        socket.on("message", message => {
            socket.to(roomId).broadcast.emit('create-message', { userId, message});
        })

        socket.on("typing", () => {
            socket.to(roomId).broadcast.emit('typing', {userId});
        })

        socket.on("stop typing", () => {
            socket.to(roomId).broadcast.emit('stop typing', { userId });
        })

        socket.on('disconnect', () => {
            --numusers
            socket.to(roomId).broadcast.emit('user-disconnected', {userId, numusers})
        })
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, function(){
    console.log(`server is listening on port: ${PORT}`)
})