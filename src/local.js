var Local = function(socket){
    var game;
    var interv = 400;
    var timer = null;
    var time = 0;
    var intervAccu = 0;
    var score = 0;
    var doms;

    
    var ranDir = function(){return Math.floor(Math.random()*7);}
    var ranRot = function(){return Math.floor(Math.random()*4);}

    var start = function(){
        doms = {
            gameDiv : document.getElementById('local_game'),
            nextDiv : document.getElementById('local_next'),
            timeDiv : document.getElementById('local_time'),
            scoreDiv : document.getElementById('local_score'),
            gameoverDiv : document.getElementById('local_gameover'),
        }
        game = new Game();
        ranDirCur = ranDir();
        ranRotCur = ranRot();
        ranDirNex = ranDir();
        ranRotNex = ranRot();
        socket.emit('init',{dir: ranDirCur, rot: ranRotCur, dir2: ranDirNex, rot2: ranRotNex});
        game.init_designated(doms, ranDirCur, ranRotCur, ranDirNex, ranRotNex);
        bindKeyEvent();
        timer = setInterval(move, interv); // How is it implemented?
    }
    var move = function(){
        var canDown = game.down(); // block move downwards as time passes
        intervAccu = intervAccu + interv/1000;
        if(intervAccu>=1){
            time = Math.round(time + intervAccu);
            intervAccu = 0;
            setTime(time);
            socket.emit('setTime', time);
        }
        if(canDown==false){
            game.curFixed();
            socket.emit('curFix');
            
            var delLineCnt = game.deleteLine();
            if(delLineCnt>0){
                score = score + 100* delLineCnt;
                setScore(score);                
                socket.emit('delLineSetScore', {delL: delLineCnt, sco: score});
            }
            var ranDirNex = ranDir();
            var ranRotNex = ranRot();
            if(game.getNextBlk_designated(ranDirNex, ranRotNex)==false){
                socket.emit('gameStop', score);
            }
            else{
                socket.emit('next',{dir: ranDirNex, rot: ranRotNex});
            }
        } 
        else{
            socket.emit('goDown');
        }
    }
    
    var gameStop = function(res){
        if(timer){
            clearInterval(timer); //
            timer = null;
        }
        document.onkeydown = null;
        if(res=='win') doms.gameoverDiv.innerHTML = "Win!";
        else doms.gameoverDiv.innerHTML = "Lose!";
    }
    var bindKeyEvent = function(){
        document.onkeydown = function(e){
            if(e.keyCode==38){//up
                game.rotate();
            }
            else if(e.keyCode==40){//down
                game.down();
            }
            else if(e.keyCode==37){//left
                game.left();
            }
            else if(e.keyCode==39){//right
                game.right();
            }
            socket.emit('buttonDown', e.keyCode);
        }
    }
    
    var setScore = function(score){
        doms.scoreDiv.innerHTML = score;
    }
    var setTime = function(time){
        doms.timeDiv.innerHTML = time;
    } 

    this.start = start;
    this.move = move;
    this.gameStop = gameStop;
    this.bindKeyEvent = bindKeyEvent;

    socket.on('start', function(str){
        document.getElementById('waiting').innerHTML = '';
        start();
    });
    socket.on('gameOver', function(res){
        gameStop(res);
    });
}