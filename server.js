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

app.get('/', function (req, res) {
    res.redirect(`/${uuidV4()}`)
});

app.get("/:room", (req, res) => {
    res.render('index', {roomId: req.params.room})
})

io.on("connection", function(socket){
    socket.on("pencilSpecs", function(pencilSpecsObj) {
        socket.broadcast.emit("onPencilSpecs", pencilSpecsObj);
    });

    socket.on("eraserSpecs", function(eraserSpecsObj) {
        socket.broadcast.emit("onEraserSpecs", eraserSpecsObj);
    });

    socket.on("handleToolChange", function(tool){
        socket.broadcast.emit("onToolChange", tool)
    })

    socket.on("hamburger", function(){
        socket.broadcast.emit("onhamburger");
    })

    socket.on("mousedown", function(pointObj){
        socket.broadcast.emit("onmousedown", pointObj);
    })

    socket.on("mouseup", function(pointObj){
        socket.broadcast.emit("onmouseup", pointObj);
    })

    socket.on("undo", function(){
        socket.broadcast.emit("onundo");
    })

    socket.on("redo", function(){
        socket.broadcast.emit("onredo");
    })

    socket.on('join-room', (roomId, userId) => {
        // allowing current socket to join the room
        socket.join(roomId)
        // sending message to the other users in the room, current user is connected to
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, function(){
    console.log(`server is listening on port: ${PORT}`)
})