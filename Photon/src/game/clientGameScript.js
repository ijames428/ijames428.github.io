/**************************************************
** GAME VARIABLES
**************************************************/
var localPlayer,                // Local player
    remotePlayers;
    
var development = true;

var level = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
var txt = "";
var c = document.getElementById("myCanvas");
c.height = level.length * 50;
c.width = level[0].length * 50;
var ctx = c.getContext("2d");
ctx.font = '18pt Calibri';
ctx.fillStyle = 'white';
var message = "";
var inputMsg = "";
var imageBG = new Image();
imageBG.src = "http://coolvibe.com/wp-content/uploads/2011/05/monolith.jpg";
var imageObj = new Image();
imageObj.src = 'http://i.imgur.com/nVINE2F.png';
var midCharX = 0;
var midCharY = 0;
var midBoxX = 0;
var midBoxY = 0;
var lastHeartBeat = Date.now();

var RIGHT = 3;
var LEFT = 4;
var NEUTRAL = 5;
var JUMP = 6;

var distX = midCharX - midBoxX;
var distY = midCharY - midBoxY;

var stats = new Stats();
stats.setMode(2);
document.body.appendChild(stats.domElement);


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {

    // Calculate a random start position for the local player
    // The minus 5 (half a player size) stops the player being
    // placed right on the egde of the screen
    var startX = c.width / 2,
        startY = c.height / 2;

    // Initialise the local player
    localPlayer = new Player(startX, startY, 'http://www.vgmuseum.com/mrp/cv-sotn/characters/saturn-alucard(2).gif');

    remotePlayers = [];
    // Start listening for events
    setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
    // Keyboard
    window.addEventListener("keydown", onKeydown, false);
    window.addEventListener("keyup", onKeyup, false);

    // Window resize
    window.addEventListener("resize", onResize, false);
};

// Keyboard key down
function onKeydown(e) {
    switch (e.which) {
        case 81://Q
            inputMsg = "Q";
            break;
        case 87://W
            inputMsg = "W";
            if (!localPlayer.getSdown())
                localPlayer.setWdown(true);
            break;
        case 69://E
            inputMsg = "E";
            break;
        case 82://R
            inputMsg = "R";
            break;
        case 49://1
            inputMsg = "1";
            break;
        case 50://2
            inputMsg = "2";
            break;
        case 51://3
            inputMsg = "3";
            break;
        case 52://4
            inputMsg = "4";
            break;
        case 65://A
            inputMsg = "A";
            if (!localPlayer.getDdown() && !localPlayer.getAdown())
            {
                localPlayer.setAdown(true);
                
                try  {
                    DefaultController.peer.raiseEvent(LEFT, {
                    id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY()
                    });
                } catch (err) {
                    DefaultController.output("error125: " + err.message);
                }
            }
            break;
        case 83://S
            inputMsg = "S";
            if (!localPlayer.getWdown())
                localPlayer.setSdown(true);
            break;
        case 68://D
            inputMsg = "D";
            if (!localPlayer.getAdown() && !localPlayer.getDdown())
            {
                localPlayer.setDdown(true);
                
                try  {
                    DefaultController.peer.raiseEvent(RIGHT, {
                    id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY()
                    });
                } catch (err) {
                    DefaultController.output("error145: " + err.message);
                }
            }
            break;
        case 32://SPACE_BAR
            inputMsg = "SPACE";
            if (!localPlayer.getinAir())
            {
                if (!localPlayer.getpreppingJump())
                    localPlayer.setjumpChargeStartTime(Date.now());
                localPlayer.setpreppingJump(true);
            }
            break;
    }
};

// Keyboard key up
function onKeyup(e) {
    switch (e.which) {
        case 81://Q
            inputMsg = "Q";
            break;
        case 87://W
            inputMsg = "W";
            localPlayer.setWdown(false);
            break;
        case 69://E
            inputMsg = "E";
            break;
        case 82://R
            inputMsg = "R";
            break;
        case 49://1
            inputMsg = "1";
            break;
        case 50://2
            inputMsg = "2";
            break;
        case 51://3
            inputMsg = "3";
            break;
        case 52://4
            inputMsg = "4";
            break;
        case 65://A
            inputMsg = "A";
            if (localPlayer.getAdown())
            {
                localPlayer.setAdown(false);
                
                try  {
                    DefaultController.peer.raiseEvent(NEUTRAL, {
                    id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY()
                    });
                } catch (err) {
                    DefaultController.output("error200: " + err.message);
                }
            }
            break;
        case 83://S
            inputMsg = "S";
            localPlayer.setSdown(false);
            break;
        case 68://D
            inputMsg = "D";
            if (localPlayer.getDdown())
            {
                localPlayer.setDdown(false);
            
                try  {
                    DefaultController.peer.raiseEvent(NEUTRAL, {
                    id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY()
                    });
                } catch (err) {
                    DefaultController.output("error219: " + err.message);
                }
            }
            break;
        case 32://SPACE_BAR
            inputMsg = "SPACE";
            if (!localPlayer.getinAir())
            {
                localPlayer.setinAir(true);
                localPlayer.setpreppingJump(false);
                if ((localPlayer.getjumpChargeStartTime() - Date.now()) / 40 <= -6)
                    localPlayer.setdY(Math.floor(Math.max((localPlayer.getjumpChargeStartTime() - Date.now()) / 40, -12)));
                else
                    localPlayer.setdY(-6);
            }
            break;
    }

    if (localPlayer.getWdown())
    {
    }
    if (localPlayer.getSdown())
    {
    }
    if (localPlayer.getAdown())
    {
        localPlayer.setdX(-1);
    }
    if (localPlayer.getDdown())
    {
        localPlayer.setdX(1);
    }

    if (!localPlayer.getAdown() && !localPlayer.getDdown() && !localPlayer.getinAir())
    {
        localPlayer.setdX(0);
    }
};

// Browser window resize
function onResize(e) {
    // Maximise the c
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    
    var newPlayer = new Player(data.x, data.y, 'http://www.vgmuseum.com/mrp/cv-sotn/characters/saturn-alucard(2).gif');
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
};

function onMovePlayerRight(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("client250Player not found: "+data.id);
        return;
    };
    
    movePlayer.setDdown(true);
    movePlayer.setAdown(false);
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};

function onMovePlayerLeft(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("client250Player not found: "+data.id);
        return;
    };
    
    movePlayer.setAdown(true);
    movePlayer.setDdown(false);
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};

function onMovePlayerNeutral(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("client250Player not found: "+data.id);
        return;
    };
    
    movePlayer.setAdown(false);
    movePlayer.setDdown(false);
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};

function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

//    console.log(data.id + " " + data.x + " " + data.y);
    // Player not found
    if (!movePlayer) {
            console.log("client250Player not found: "+data.id);
            return;
    };
    
    // Update player position
    
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
//    movePlayer.x = data.x;
//    movePlayer.y = data.y;
};

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
    update();
    draw();

    // Request a new animation frame using Paul Irish's shim
    window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
    stats.begin();
    
    updateMovement(localPlayer);
    
    for (i = 0; i < remotePlayers.length; i++) {
        updateMovement(remotePlayers[i]);
    };
    
    ctx.clearRect(0, 0, c.width, c.height);
    drawWorld();

    stats.end();
};

function updateMovement(player)
{
    if (player.getAdown())
    {
        player.setdX(-1);
    }
    if (player.getDdown())
    {
        player.setdX(1);
    }
    if (!player.getDdown() && !player.getAdown())
    {
        player.setdX(0);
    }

    if (!CheckCollision(player))
        player.setinAir(true);

    if (player.getinAir())
    {
        player.setdX(player.getdX() * 0.5);
        player.setdY(player.getdY() + 0.25);
    }

//    localPlayer.setdX(Math.floor(localPlayer.getdX() * 100) / 100);
//    localPlayer.setdY(Math.floor(localPlayer.getdY() * 100) / 100);
        
    if (!player.getpreppingJump() || ((player.getjumpChargeStartTime() - Date.now()) / 40 >= -3))
        player.setX(Math.floor(player.getX() + player.getdX() * player.getspd()));
    if (player.getinAir())
        player.setY(player.getY() + player.getdY());

//    if (lastHeartBeat + 200 < Date.now())
//    {
//        try  {
//            DefaultController.peer.raiseEvent(2, {
//                id: player.getid(), x: player.getX(), y: player.getY()
//            });
//            DefaultController.output("sent HB");
//        } catch (err) {
//            DefaultController.output("error392: " + err.message);
//        }
//        lastHeartBeat = Date.now();
//    }
}

function CheckCollision(player) {
    if (player.getX() - 1 * player.getspd() < 0)
    {
        if (player.getdX() < 0)
            player.setdX(0);
    }
    if (player.getY() + 1 * player.getspd() < 0)
    {
        player.setY(0);
    }
    if (player.getX() + 1 * player.getspd() > c.width - player.getcharW())
    {
        if (player.getdX() > 0)
            player.setdX(0);
    }
    if (player.getY() - 1 * player.getspd() > c.height - player.getcharH())
    {
        player.setY(c.height - player.getcharH());
    }

    for (x = 0; x < level[0].length; x++)
    {
        for (y = 0; y < level.length; y++)
        {
            if (level[y][x] == 1)
            {
                midCharX = player.getX() + player.getcharW() / 2;//+ localPlayer.getdX() * localPlayer.getspd() + localPlayer.getcharW()/2;
                if (player.getinAir())
                    midCharY = player.getY() + player.getdY() + player.getcharH() / 2;
                else
                    midCharY = player.getY() + player.getcharH() / 2;
                midBoxX = x * 50 + 25;
                midBoxY = y * 50 + 25;

                distX = midCharX - midBoxX;
                distY = midCharY - midBoxY;

                if (Math.abs(distX) < player.getcharW() / 2 + 25 && Math.abs(distY) < player.getcharH() / 2 + 25)
                {
                    if (distY <= 0 && player.getdY() > 0)//above
                    {
                        player.setY(y * 50 - player.getcharH());
                        player.setdY(0);
                        player.setinAir(false);
                        player.setdX(0);
                    }
                    else if (distY > 0 && player.getdY() < 0)//below
                    {
                        player.setdY(0);
                    }
                    //need to figure out what the primary direction is.
                    if (distX < 0 && player.getdX() > 0)//left
                    {
                        player.setdX(0);
                    }
                    else if (distX > 0 && player.getdX() < 0)//right
                    {
                        player.setdX(0);
                    }

                    return true;
                }
                if (Math.abs(distX) < player.getcharW() / 2 + 25 && Math.abs(distY) < player.getcharH() / 2 + 26)
                {
                    if (distY <= 0 && player.getdY() > 0)//above
                    {
                        player.setY(y * 50 - player.getcharH());
                        player.setdY(0);
                        player.setinAir(false);
                        player.setdX(0);
                    }
                    return true;
                }
            }
        }
    }

    return false;
};

function drawWorld() {
    ctx.drawImage(imageBG, c.width / 2 - 960, c.height / 2 - 400);
    for (x = 0; x < level[0].length; x++)
    {
        for (y = 0; y < level.length; y++)
        {
            if (level[y][x] == 1)
            {
                ctx.drawImage(imageObj, x * 50, y * 50);
            }
        }
    }
    writeMessage();
};

function writeMessage() {
    ctx.fillText(localPlayer.getX() + " " + localPlayer.getY(), 10, 25);
//    ctx.fillText(localPlayer.getinAir(), 10, 55);
//    ctx.fillText(inputMsg, 10, 85);
    if (development)
    {
        ctx.fillText("Binsou", localPlayer.getX() + localPlayer.getdX(), localPlayer.getY() - 25 + localPlayer.getdY());
        ctx.fillText("<DEV>", localPlayer.getX() + localPlayer.getdX(), localPlayer.getY() - 5 + localPlayer.getdY());
    }
    else if (localPlayer.getname())
        ctx.fillText(localPlayer.getname(), localPlayer.getX() + localPlayer.getdX(), localPlayer.getY() - 5 + localPlayer.getdY());
}

function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

c.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(c, evt);
    message = mousePos.x + ',' + mousePos.y;
}, false);

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
//        console.log(remotePlayers[i].id);
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
    // Draw the local player
    localPlayer.draw(ctx);
    
    var i;

    for (i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    };
};

/// <reference path="Photon/Photon-Javascript_SDK.d.ts"/>
var PhotonServerAddress = "24.149.29.78:9090";
var DefaultController = (function () {
    function DefaultController() { }
    DefaultController.logger = new Exitgames.Common.Logger("Demo:");
    DefaultController.setupUI = function setupUI() {
        this.logger.info("Setting up UI.");
        var input = document.getElementById("input");
        input.value = 'hello';
        input.focus();
        var form = document.getElementById("mainfrm");
        form.onsubmit = function () {
            var input = document.getElementById("input");
            try  {
                DefaultController.peer.raiseEvent(1, {
                    message: String(input.value)
                });
                DefaultController.output('me[' + DefaultController.peer.myActor().photonId + ']: ' + input.value);
            } catch (err) {
                DefaultController.output("error565: " + err.message);
            }
            input.value = '';
            input.focus();
            return false;
        };
        var btn = document.getElementById("closebtn");
        btn.onclick = function (ev) {
            DefaultController.peer.disconnect();
            return false;
        };
    };
    DefaultController.start = function start() {
        DefaultController.peer = new Photon.Lite.LitePeer("ws://" + PhotonServerAddress, '');
        DefaultController.peer.setLogLevel(Exitgames.Common.Logger.Level.DEBUG);
        // Set event handlers.
        DefaultController.peer.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, function () {
            DefaultController.output("Connected!");
            DefaultController.peer.join('DemoChat');
        });
        DefaultController.peer.addResponseListener(Photon.Lite.Constants.LiteOpCode.Join, function (e) {
            localPlayer.id = e.actorNr;
            DefaultController.output('I joined with id: [' + e.actorNr + '].');
        });
        DefaultController.peer.addEventListener(Photon.Lite.Constants.LiteEventCode.Join, function (e) {
            for(var i = 0; i < e.newActors.length; i++) {
                if(e.newActors[i] != DefaultController.peer.myActor().photonId) {
                    onNewPlayer({id: e.actorNr, x: 400, y: 200});
                    DefaultController.output('actor[' + e.newActors[i] + '] joined!');
                }
            }
        });
        DefaultController.peer.addEventListener(Photon.Lite.Constants.LiteEventCode.Leave, function (e) {
            DefaultController.output('actor[' + e.actorNr + '] left!');
        });
        DefaultController.peer.addEventListener(1, function (data) {
            var text = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].message;// we get JSON back from Photon, the text we pass in by submitMessage() below is passed back here
            
            var actorNr = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.ActorNr];// each client joining is identified with a actor number.
            
            DefaultController.peer._logger.debug('myChat - chat message:', arguments[0]);
            DefaultController.output('actor[' + actorNr + '] - says: ' + text);
        });
        DefaultController.peer.addEventListener(2, function (data) {
            var actorNr = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.ActorNr];
            var dataid = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datax  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].x;
            var datay  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].y;
            onMovePlayer({id : dataid, x : datax, y : datay});
            DefaultController.output('actor[' + actorNr + " " + dataid + '] - says: ' + datax + " " + datay);
        });
        DefaultController.peer.addEventListener(RIGHT, function (data) {
            var dataid = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datax  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].x;
            var datay  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].y;
            onMovePlayerRight({id : dataid, x : datax, y : datay});
        });
        DefaultController.peer.addEventListener(LEFT, function (data) {
            var dataid = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datax  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].x;
            var datay  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].y;
            onMovePlayerLeft({id : dataid, x : datax, y : datay});
        });
        DefaultController.peer.addEventListener(NEUTRAL, function (data) {
            var dataid = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datax  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].x;
            var datay  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].y;
            onMovePlayerNeutral({id : dataid, x : datax, y : datay});
        });
        DefaultController.peer.connect();
    };
    DefaultController.output = function output(str) {
        var log = document.getElementById("theDialogue");
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;").replace(/"/, "&quot;");
        log.innerHTML = log.innerHTML + escaped + "<br>";
        log.scrollTop = log.scrollHeight;
    };
    return DefaultController;
})();
window.onload = function () {
    DefaultController.setupUI();
    DefaultController.start();
};
