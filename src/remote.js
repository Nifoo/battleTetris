var Remote = function(socket){
    var game;
    var interv = 400;
    var timer = null;
    var time = 0;
    var intervAccu = 0;
    var score = 0;
    var doms;

    /*
    var bindEvents = function(){
        document.getElementById('down').onclick = function(){
            game.down();
        }
        document.getElementById('left').onclick = function(){
            game.left();
        }
        document.getElementById('right').onclick = function(){
            game.right();
        }
        document.getElementById('rotate').onclick = function(){
            game.rotate();
        }
        document.getElementById('down').onclick = function(){
            game.down();
        }
        document.getElementById('curFixed').onclick = function(){
            game.curFixed();
        }
        document.getElementById('getNext').onclick = function(){
            game.getNextBlk_designated(1,1);
        }
        document.getElementById('deleteLine').onclick = function(){
            game.deleteLine();
        }
        document.getElementById('setScore').onclick = function(){
            setScore(1);
        }
        document.getElementById('setTime').onclick = function(){
            setTime(10);
        }
        document.getElementById('gameStop').onclick = function(){
            gameStop(true);
        }
    }
    */

    var start = function(ranDirCur, ranRotCur, ranDirNex, ranRotNex){
        doms = {
            gameDiv : document.getElementById('remote_game'),
            nextDiv : document.getElementById('remote_next'),
            timeDiv : document.getElementById('remote_time'),
            scoreDiv : document.getElementById('remote_score'),
            gameoverDiv : document.getElementById('remote_gameover'),
        }
        game = new Game();
        game.init_designated(doms, ranDirCur, ranRotCur, ranDirNex, ranRotNex);
        //bindEvents();
        //timer = setInterval(move, interv); // How is it implemented?
    }
    
    var gameStop = function(res){
        if(res=='lose') doms.gameoverDiv.innerHTML = "Win!";
        else doms.gameoverDiv.innerHTML = "Lose!";
    }

    
    var setScore = function(score){
        doms.scoreDiv.innerHTML = score;
    }
    var setTime = function(time){
        doms.timeDiv.innerHTML = time;
    } 

    this.start = start;

    socket.on('init', function(data){
        start(data.dir, data.rot, data.dir2, data.rot2);
    });
    socket.on('buttonDown', function(keyCode){
        if(keyCode==38){//up
            game.rotate();
        }
        else if(keyCode==40){//down
            game.down();
        }
        else if(keyCode==37){//left
            game.left();
        }
        else if(keyCode==39){//right
            game.right();
        }
    });    
    socket.on('setTime', function(data){
        setTime(data);
    });
    socket.on('curFix', function(data){
        game.curFixed();
    });
    socket.on('delLineSetScore', function(data){
        game.deleteLine();
        setScore(data.sco);
    });
    socket.on('gameOver', function(res){
        gameStop(res);
    });
    socket.on('next', function(data){
        game.getNextBlk_designated(data.dir, data.rot);
    });
    socket.on('goDown', function(data){
        game.down();
    });
}