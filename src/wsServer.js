var app = require('http').createServer()
var io = require('socket.io')(app);
var portNum = 3000;
var clientCnt = 0;
var socketMap = {};
var opo;

app.listen(portNum);
console.log('listen on port '+portNum);

var bindListener = function(socket, event){
    socket.on(event, function(data){
        //console.log('client'+ socket.clientNum + event);
        if(socket.clientNum % 2 ==1) opo = socket.clientNum+1;
        else opo = socket.clientNum-1;
        socketMap[opo].emit(event, data);
    });
}

io.on('connection', function (socket) {
    clientCnt++;
    socket.clientNum = clientCnt;
    socket.gameStop = false;
    socketMap[clientCnt] = socket;
    console.log('client ' + clientCnt + ' connected ');
    if(clientCnt % 2 == 1){
        socket.emit('waiting', 'waiting for another player...');
    }
    else{
        socket.emit('start',  'game start!');
        socketMap[clientCnt-1].emit('start',  'game start!');
    }
    
    bindListener(socket, 'init'); 
    bindListener(socket, 'setTime');    
    bindListener(socket, 'buttonDown');
    bindListener(socket, 'curFix');
    bindListener(socket, 'delLineSetScore');
    bindListener(socket, 'gameStop');
    bindListener(socket, 'next');
    bindListener(socket, 'goDown');
    socket.on('gameStop', function(data){
        //console.log('client'+ socket.clientNum + event);
        socket.gameStop = true;
        if(socket.clientNum % 2 ==1) opo = socket.clientNum+1;
        else opo = socket.clientNum-1;
        if(socketMap[opo].gameStop==false){
            socket.res = 'lose';
            socket.emit('gameOver', 'lose');
        }
        else{
            socket.res = 'win';
            socket.emit('gameOver', 'win');
        }
    });
});