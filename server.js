const express = require("express");
const app = express();
const server = require("http").createServer(app)
const io = require("socket.io")(server);

app.use(express.static("public"))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

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
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, function(){
    console.log(`server is listening on port: ${PORT}`)
})