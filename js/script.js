var myGamePiece;
var myObstacles = [];
var myScore;
var player;
var background;
var gamedata;
var islands = [];
var enemies = [];
var bullets = [];
var backgroundMusic;
var soundExp1;
var soundExp2;
var level;
var space = 0; 
var enemyInterval = 100;
var enemySpeed = 3;
var backgroundSpeed = 2;
var flags = [];
var modal;
var pause = false;
var highscore = getHighScore();
if (highscore == null || highscore == "") {
    highscore = 0;
}
else {
    highscore = parseInt(highscore);
}


function initUI() {
	modal = document.getElementById('myModal');

    document.getElementById("body-content").innerHTML =
                        "<h3>"+
                        "HighScore        :        "+highscore+
                        "</h3>"+
                        "<h4>"+
                            "Controls"+
                        "</h4>"+
                        "<p>"+
                            "Up-Arrow        :       Move Up </br>"+
                            "Down-Arrow      :       Move Down </br>"+
                            "Left-Arrow      :       Move Left </br>"+
                            "Right-Arrow     :       Move Right </br>"+
                            "Space            :       Shoot </br>"+
                            "P                :       Pause </br>"+
                        "</p>"+
                        "Kill as many enemies you can and collect flags"    
	
	
	document.getElementById("btn").onclick = function() {
        if (pause == false) {
    		modal.style.display = "none";
    		startGame();
        }
        else {
            pause = false;
            modal.style.display = "none";
        }
	}
	
	displayModal();
}

function getHighScore () {
    if (localStorage) {
        return localStorage.getItem("highscore");
    }
    else
    {
        return document.cookie;
    }
}

function setHighScore (high) {
    if (localStorage) {
        return localStorage.setItem("highscore",high);
    }
    else {
        return document.cookie;
    }
}

function displayModal() {
	modal.style.display = "block";
}

function hideModal() {
    modal.style.display = "none";
}

function displayModalScore() {
    document.getElementById("body-content").innerHTML = "<h2> Game Over </h2>"+
                        "<h3>"+
                        "HighScore        :        "+highscore+
                        "</h3>"+    
    "<p>Score  :  "+gamedata.score+"</br>"+
    "Enemies hit  :  "+gamedata.hits+"</br>"+
    "Flags aquired  :  "+gamedata.gotFlags+"</br></br>"+
    "Do you want to give it another try ??? </p>";

    modal.style.display = "block";
    document.getElementById("btn").innerHTML = "Begin..."
}

function displayPauseModal() {
    document.getElementById("body-content").innerHTML = 
                        "<h3>"+
                        "HighScore        :        "+highscore+
                        "</h3>"+
                        "<h4>"+
                            "Controls"+
                        "</h4>"+    
                        "<p>"+
                            "Up-Arrow        :       Move Up </br>"+
                            "Down-Arrow      :       Move Down </br>"+
                            "Left-Arrow      :       Move Left </br>"+
                            "Right-Arrow     :       Move Right </br>"+
                            "Space            :       Shoot </br>"+
                            "P                :       Pause </br>"+
                        "</p>"+
                        "Kill as many enemies you can and collect flags"
    document.getElementById("btn").innerHTML = "Resume...";
    modal.style.display = "block";                    
}


function startGame() {
    player = new Player(80, 80, "red", 400, 500);
   	background = new Background(800, 800, "background1.jpg", 0, 0);
   	gamedata = new GameData();
    backgroundmusic = new SoundLoop("../sound/back_music.mp3");
    soundExp1 = new Sound("../sound/snd_explosion1.wav");
    soundExp2 = new Sound("../sound/snd_explosion2.wav");
    level = new Sound("../sound/level.wav");
    backgroundmusic.play();
    myGameArea.start();

}

function GameData() {
	this.score = 0;
	this.lives = 3;
	this.hits = 0;
	this.gotFlags = 0;
	this.fontsize = "30px";
	this.fontfamily = "Consolas";
	this.color = "red";
	this.x = 450;
	this.y = 50

	this.updateScore = function(addScore) {
		this.score += addScore;
	}
	this.reduceLife = function() {
		this.lives -= 1;
	}
	this.updateHits = function(hits) {
		this.hits += hits;
	}
	this.updateFlags = function(addFlags) {
		this.gotFlags += addFlags;
	}
	this.update = function() {
		ctx = myGameArea.context;
		ctx.font = this.fontsize + " " + this.fontfamily;
        ctx.fillStyle = this.color;
        ctx.fillText("Score : "+this.score+" Lives : "+this.lives, this.x, this.y);
        ctx.font = "20px Consolas";
        ctx.fillStyle = this.color;
        ctx.fillText("Targets hit : "+this.hits,this.x,this.y+20);
        ctx.fillText("Flags obtained : "+this.gotFlags, this.x, this.y+40);

	}
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.getElementById("canvasholder").appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
            if(e.keyCode == 32) {
                space = 1;
            }
            if(e.keyCode == 80) {
                pause = !pause;
                if (pause == true) {
                    displayPauseModal();
                }
                else {
                    hideModal();
                }
            }
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
            if(e.keyCode == 32) {
                space = 0;
            }
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function Enemy(width, height, x, y) {
    this.type=0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0; 
    this.speed = 0;   
    this.x = x;
    this.y = y;   
    this.angle = 0;
    this.moveAngle = 0; 
    var r = Math.floor(Math.random()*(3)+1);
    if (r == 1) {
    	this.image = document.getElementById("enemy1");
    }
    else if(r == 2) {
    	this.image = document.getElementById("enemy2");
    }
    else {
    	this.image = document.getElementById("enemy3");
    }
    

    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
    	this.x += this.speedX;
        this.y += this.speedY;   
    }

    
}

function Bullet(width, height, x, y) {
    this.type=0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0; 
    this.speed = 0;   
    this.x = x;
    this.y = y;   
    this.angle = 0;
    this.moveAngle = 0; 
    this.image = document.getElementById("bullet");
    

    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
    	this.x += this.speedX;
        this.y += this.speedY;   
    }
    this.hit = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
function Player(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0; 
    this.speed = 0;   
    this.x = x;
    this.y = y;   
    this.angle = 0;
    this.moveAngle = 0; 
    this.image = document.getElementById("player");
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image,this.x,this.y, this.width, this.height);
            
    }
    this.newPos = function() {
	    this.x += this.speedX
	    this.y += this.speedY;
	    if(this.x > myGameArea.canvas.width - this.width) {
	    	this.x = myGameArea.canvas.width - this.width;
	    }
	    if(this.x < 0) {
	    	this.x = 0;
	    }
	    if(this.y < 0) {
	    	this.y=0;
	    }
	    if(this.y > myGameArea.canvas.height - this.height) {
	    	this.y = myGameArea.canvas.height - this.height;
	    }
	}
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function Background(width, height, color, x, y) {
    this.image = document.getElementById("background");
    
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y,this.width, this.height);
        ctx.drawImage(this.image, this.x, this.y-this.height, this.width, this.height);
    }
    this.newPos = function() {
    	if (this.y == this.height) {
    		this.y = 0;
    	}
    	else {
    		this.y += this.speedY;
    	}
    }
    
}
// island object definition
function Island(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;   
    this.x = x;
    this.y = y;   
    var image1 = document.getElementById("island1");
    var image2 = document.getElementById("island2");
    var r = Math.floor(Math.random()*(2)+1);
    if (r==1) {this.image = image1;}
    else {this.image = image2;}	
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
    	this.x += this.speedX;
        this.y += this.speedY;   
    }
}

function Flag(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;   
    this.x = x;
    this.y = y;   
    this.image = document.getElementById("goal");
    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;   
    }
}

function SoundLoop(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("loop","loop");
    this.sound.style.display = "none";
    document.getElementById("assets").appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.getElementById("assets").appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}



function updateGameArea() {
    if (pause == false) {
        
        var x, height, gap, minHeight, maxHeight, minGap, maxGap;
        myGameArea.clear();
        background.speedY = backgroundSpeed;
        background.newPos(); 
        background.update();
        
        
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(200)) {
            x = myGameArea.canvas.width;
            minHeight = 80;
            maxHeight = 150;
            minWidth = 60;
            maxWidth = 130;
            xmin = 0;
            xmax = myGameArea.canvas.width;
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
            width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
            x = Math.floor(Math.random()*(xmax-xmin+1)+xmin);
            minGap = 50;
            maxGap = 200;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
            islands.push(new Island(width, height, x, -200));
        }
        for (i = 0; i < islands.length; i += 1) {
            islands[i].speedY = backgroundSpeed;
            islands[i].newPos();
            islands[i].update();
        }
        if (myGameArea.frameNo == 1 || everyinterval(enemyInterval)) {
            x = myGameArea.canvas.width-80;
            minHeight = 20;
            maxHeight = 50;
            minWidth = 10;
            maxWidth = 50;
            xmin = 0;
            xmax = myGameArea.canvas.width-80;
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
            width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
            x = Math.floor(Math.random()*(xmax-xmin+1)+xmin);
            minGap = 50;
            maxGap = 200;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
            enemies.push(new Enemy(80, 80, x, -100));
            gamedata.updateScore(10);
            //console.log(enemies.length);
            //myObstacles.push(new component(width, x - height - gap, "green", x, height + gap));
        }
        for (i = 0; i < enemies.length; i += 1) {
            enemies[i].speedY = enemySpeed;
            if(enemies[i].y > myGameArea.canvas.height) {
            	enemies.splice(i,1);
            }
            enemies[i].newPos();
            enemies[i].update();
        }

        
        player.moveAngle = 0;
       	player.speedX = 0;
       	player.speedY = 0;
        if (myGameArea.keys && myGameArea.keys[37]) {player.speedX = -7; }
        if (myGameArea.keys && myGameArea.keys[39]) {player.speedX = 7; }
        if (myGameArea.keys && myGameArea.keys[38]) {player.speedY = -7; }
        if (myGameArea.keys && myGameArea.keys[40]) {player.speedY = 7; }
        if (myGameArea.keys && myGameArea.keys[32]) {
           
           if(space == 1) {
                bullets.push(new Bullet(20,25,player.x+player.width/2-10,player.y));
                space = 0;
           }
        }

        for (i = 0; i < bullets.length; i += 1) {
            bullets[i].speedY = -10;
            bullets[i].newPos();
            bullets[i].update();
            for(j = 0; j < enemies.length; j++) {
            	if (bullets[i].hit(enemies[j])) {
            		enemies[j].y=2000;
            		bullets[i].y=-2000;
            		gamedata.updateHits(1);
                    soundExp1.play();
            		break;
            	}
            }
            if(bullets[i].y + bullets[i].height < 0) {
            	bullets.splice(i,1);
            }
            
        }

        player.newPos();
        player.update();
        for (i = 0; i < enemies.length; i += 1) {
            if (player.crashWith(enemies[i])) {
                
                if (gamedata.lives == 1) {
                
    	            myGameArea.stop();
    	            enemies = [];
    	            bullets = [];
    	            islands = [];
                    soundExp2.play();
                    backgroundmusic.stop();
                    enemyInterval = 100;
                    enemySpeed = 3;
                    gamedata.score = gamedata.score + 10 * gamedata.hits + 20 * gamedata.gotFlags;
                    if (gamedata.score > highscore) {
                        highscore = gamedata.score;
                        setHighScore(""+highscore);
                    }
                    
    	            displayModalScore();
    	        }
                else {
                    player.x = 400;
                    player.y = 500;
                    gamedata.lives -= 1;
                    enemies[i].y = -2000;
                    soundExp2.play();

                }

    	        
            } 
        }
        
        if(gamedata.score % 200 == 0) {
            enemyInterval = Math.max(24 , enemyInterval - 2);
            enemySpeed = Math.min(10, enemySpeed + 0.01);
            //backgroundSpeed = Math.min(4, backgroundSpeed + 0.5);
        }
        if(gamedata.score %300 == 0) {
            xmax = myGameArea.canvas.width - 80;
            xmin = 0;
            x = Math.floor(Math.random()*(xmax-xmin+1)+xmin);
            if(flags.length == 0) {
            	flags.push(new Flag(80,80,x,-100));
            }
        }

        for (i = 0; i < flags.length; i += 1) {
            flags[i].speedY = 3;
            flags[i].newPos();
            flags[i].update();
            if(flags[i].y > myGameArea.canvas.height) {
                flags.splice(i,1);
            }
            
        }

        for (i=0; i<flags.length; i++) {
            if (player.crashWith(flags[i])) {
                gamedata.updateFlags(1);
                flags[i].y=2000;
                level.play();

            }
        }

        gamedata.update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup() {
    player.speedY = -1; 
}

function movedown() {
    player.speedY = 1; 
}

function moveleft() {
    player.speedX = -1; 
}

function moveright() {
    player.speedX = 1; 
}

function clearmove() {
    player.speedX = 0; 
    player.speedY = 0; 
}