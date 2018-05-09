var Game = function(){
    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    var cur;
    var next;

    var nextDivs = [];
    var gameDivs = [];
    var initDiv = function(container, data, divs){
        for(var i=0; i<data.length; i++){
            var div = [];
            for(var j=0; j<data[0].length; j++){
                var newNode = document.createElement('div');
                newNode.className = 'none';
                newNode.style.top = i*20+'px';
                newNode.style.left = j*20+'px';
                container.appendChild(newNode); // need optimization
                div.push(newNode);
            }
            divs.push(div);
        }
    }


    // check the validity of a position (pos.x+x, pos.y+y): in the gameData region and not occupied by other block yet.
    var checkPos = function(pos, x, y){
        var maybeX = pos.x + x;
        var maybeY = pos.y + y;
        return ((maybeX>=0) && (maybeX<gameData.length) && (maybeY>=0) && (maybeY<gameData[0].length) && (gameData[maybeX][maybeY]==0));
    }

    // check the validity of a block
    var checkBlk = function(cur, tmpOrigin){
        for(var i=0; i<cur.data.length; i++){
            for(var j=0; j<cur.data[0].length; j++){
                if(cur.data[i][j]!=0){
                    if(checkPos(tmpOrigin, i, j)==false) return false;
                }
            }
        }
        return true;
    }

    var setData = function(){
        for(var i=0; i<cur.data.length; i++){
            for(var j=0; j<cur.data[0].length; j++){
                if(cur.data[i][j]!=0){
                    gameData[cur.origin.x+i][cur.origin.y+j] = cur.data[i][j];
                }
            }
        }
    }
    var clearData = function(){
        for(var i=0; i<cur.data.length; i++){
            for(var j=0; j<cur.data[0].length; j++){
                if(cur.data[i][j]!=0){
                    gameData[cur.origin.x+i][cur.origin.y+j] = 0;
                }
            }
        }
    }

    var down = function(){
        clearData();
        var tmpOrigin = squareFactory(cur.num, 0);
        tmpOrigin.x = cur.origin.x + 1;
        tmpOrigin.y = cur.origin.y;
        var canDown;
        if(checkBlk(cur, tmpOrigin)==true){
            cur.origin.x++;
            canDown = true;
        }
        else canDown = false;
        setData();
        refreshDiv(gameData, gameDivs);
        return canDown;
    }

    var left = function(){
        clearData();
        var tmpOrigin = squareFactory(cur.num, 0);
        tmpOrigin.x = cur.origin.x;
        tmpOrigin.y = cur.origin.y-1;

        if(checkBlk(cur, tmpOrigin)==true){
            cur.origin.y--;
        }
        setData();
        refreshDiv(gameData, gameDivs);
    }
    var right = function(){
        clearData();
        var tmpOrigin = squareFactory(cur.num, 0);
        tmpOrigin.x = cur.origin.x;
        tmpOrigin.y = cur.origin.y+1;

        if(checkBlk(cur, tmpOrigin)==true){
            cur.origin.y++;
        }
        setData();
        refreshDiv(gameData, gameDivs);
    }    
    var rotate = function(){
        clearData();
        var tmpSquare = squareFactory(cur.num, 0);
        tmpSquare.origin = cur.origin;
        tmpSquare.data = cur.rotates[(cur.dir+1)%4];
        if(checkBlk(tmpSquare, tmpSquare.origin)==true){
            cur.dir = (cur.dir+1)%4;
            cur.data = cur.rotates[cur.dir];
        }
        setData();
        refreshDiv(gameData, gameDivs);
    }
    
    var refreshDiv = function(data, divs){
        for(var i=0; i<data.length; i++){
            for(var j=0; j<data[0].length; j++){
                if(data[i][j]==0) divs[i][j].className='none';
                else if (data[i][j]==1) divs[i][j].className='current';
                else if (data[i][j]==2) divs[i][j].className='done';
            }
        }
    }


    var curFixed = function(){
        for(var i=0; i<cur.data.length; i++){
            for(var j=0; j<cur.data[0].length; j++){
                if(cur.data[i][j]==1){
                    gameData[cur.origin.x+i][cur.origin.y+j] = 2;
                }
            }
        }
        refreshDiv(gameData, gameDivs);
    }

    var getNextBlk = function(){
        cur = next;
        if(checkBlk(cur, cur.origin)==false) return false;
        setData();
        var ranDirNex = ranDir();
        var ranRotNex = ranRot();
        next = squareFactory(ranDirNex, ranRotNex);
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
        return true;
    }

    var getNextBlk_designated = function(ranDirNex, ranRotNex){
        cur = next;
        if(checkBlk(cur, cur.origin)==false) return false;
        setData();
        next = squareFactory(ranDirNex, ranRotNex);
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
        return true;
    }

    var deleteLine = function(){
        var delLineCnt = 0;
        var lineFilled = true;
        for(var i=gameData.length-1; i>=0; i--){
            lineFilled = true;
            for(var j=0; j<gameData[0].length; j++){
                if(gameData[i][j]!=2){
                    lineFilled = false; break;
                }
            }
            if(lineFilled==true){
                delLineCnt++;
                for(var abv=i; abv>0; abv--){
                    for(var j=0; j<gameData[0].length; j++){
                        gameData[abv][j] = gameData[abv-1][j];
                    }
                }
                for(var j=0; j<gameData[0].length; j++){
                    gameData[0][j] = 0;
                }
                i++; // from this line start checking
            }
        }
        refreshDiv(gameData, gameDivs);
        return delLineCnt;
    }

    var ranDir = function(){return Math.floor(Math.random()*7);}
    var ranRot = function(){return Math.floor(Math.random()*4);}

    var init = function(doms){
        gameDiv = doms.gameDiv; // element in html (container) to be appendChild
        nextDiv = doms.nextDiv;
        var ranDirCur = ranDir();
        var ranRotCur = ranRot();
        cur = squareFactory(ranDirCur, ranRotCur);

        var ranDirNex = ranDir();
        var ranRotNex = ranRot();
        next = squareFactory(ranDirNex, ranRotNex);

        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        setData();
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
    }

    var init_designated = function(doms, ranDirCur, ranRotCur, ranDirNex, ranRotNex){
        gameDiv = doms.gameDiv; // element in html (container) to be appendChild
        nextDiv = doms.nextDiv;
        cur = squareFactory(ranDirCur, ranRotCur);
        next = squareFactory(ranDirNex, ranRotNex);

        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        setData();
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
    }
    /*
    var checkGameOver = function(){
        var isGameOver = !checkBlk(next, next.origin);
        return isGameOver;
    }
    */

    this.init = init; 
    this.init_designated = init_designated;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    this.curFixed = curFixed;
    this.getNextBlk = getNextBlk;
    this.getNextBlk_designated = getNextBlk_designated;
    this.deleteLine = deleteLine;
    //this.checkGameOver = checkGameOver;


}