var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);

console.log("Server started.");

var io = require('socket.io')(serv, {});
var SOCKET_LIST = {}

io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 0;
    SOCKET_LIST[socket.id] = socket;

    console.log('socket connection');
    socket.on('Happy', function(data){
        console.log('happy because ' +  data.reason);
        console.log('My ID is ' + data.id);
    });

    socket.emit('serverMsg', {
        msg: 'hello',
    });
});

setInterval(function(){
    for (var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.x++;
        socket.y++;
        socket.emit('newPosition', {
            x:socket.x,
            y:socket.y
        });
    }
}, 1000/25);