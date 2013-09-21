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
            if (!localPlayer.getDdown())
                localPlayer.setAdown(true);
            break;
        case 83://S
            inputMsg = "S";
            if (!localPlayer.getWdown())
                localPlayer.setSdown(true);
            break;
        case 68://D
            inputMsg = "D";
            if (!localPlayer.getAdown())
                localPlayer.setDdown(true);
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
                localPlayer.setAdown(false);
            break;
        case 83://S
            inputMsg = "S";
            localPlayer.setSdown(false);
            break;
        case 68://D
            inputMsg = "D";
            if (localPlayer.getDdown())
                localPlayer.setDdown(false);
            break;
        case 32://SPACE_BAR
            inputMsg = "SPACE";
            if (!localPlayer.getinAir())
            {
                localPlayer.setinAir(true);
                localPlayer.setpreppingJump(false);
                if ((localPlayer.getjumpChargeStartTime() - Date.now()) / 40 <= -6)
                    localPlayer.setdY(Math.max((localPlayer.getjumpChargeStartTime() - Date.now()) / 40, -12));
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

    if (localPlayer.getAdown())
    {
        localPlayer.setdX(-1);
    }
    if (localPlayer.getDdown())
    {
        localPlayer.setdX(1);
    }

    ctx.clearRect(0, 0, c.width, c.height);
    drawWorld();

    if (!CheckCollision())
        localPlayer.setinAir(true);

    if (localPlayer.getinAir())
    {
        localPlayer.setdX(localPlayer.getdX() * 0.5);
        localPlayer.setdY(localPlayer.getdY() + 0.2);
    }

    if (!localPlayer.getpreppingJump() || ((localPlayer.getjumpChargeStartTime() - Date.now()) / 40 >= -3))
        localPlayer.setX(localPlayer.getX() + localPlayer.getdX() * localPlayer.getspd());
    if (localPlayer.getinAir())
        localPlayer.setY(localPlayer.getY() + localPlayer.getdY());

//    ctx.drawImage(localPlayer.imgChar, localPlayer.getX(), localPlayer.getY());
    
//    if (localPlayer.getdX() != 0 || localPlayer.getdY() != 0)
//        socket.emit("move player", {id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY()});

    stats.end();
};

function CheckCollision() {
    if (localPlayer.getX() - 1 * localPlayer.getspd() < 0)
    {
        if (localPlayer.getdX() < 0)
            localPlayer.setdX(0);
    }
    if (localPlayer.getY() + 1 * localPlayer.getspd() < 0)
    {
        localPlayer.setY(0);
    }
    if (localPlayer.getX() + 1 * localPlayer.getspd() > c.width - localPlayer.getcharW())
    {
        if (localPlayer.getdX() > 0)
            localPlayer.setdX(0);
    }
    if (localPlayer.getY() - 1 * localPlayer.getspd() > c.height - localPlayer.getcharH())
    {
        localPlayer.setY(c.height - localPlayer.getcharH());
    }

    for (x = 0; x < level[0].length; x++)
    {
        for (y = 0; y < level.length; y++)
        {
            if (level[y][x] == 1)
            {
                midCharX = localPlayer.getX() + localPlayer.getcharW() / 2;//+ localPlayer.getdX() * localPlayer.getspd() + localPlayer.getcharW()/2;
                if (localPlayer.getinAir())
                    midCharY = localPlayer.getY() + localPlayer.getdY() + localPlayer.getcharH() / 2;
                else
                    midCharY = localPlayer.getY() + localPlayer.getcharH() / 2;
                midBoxX = x * 50 + 25;
                midBoxY = y * 50 + 25;

                distX = midCharX - midBoxX;
                distY = midCharY - midBoxY;

                if (Math.abs(distX) < localPlayer.getcharW() / 2 + 25 && Math.abs(distY) < localPlayer.getcharH() / 2 + 25)
                {
                    if (distY <= 0 && localPlayer.getdY() > 0)//above
                    {
                        localPlayer.setY(y * 50 - localPlayer.getcharH());
                        localPlayer.setdY(0);
                        localPlayer.setinAir(false);
                        localPlayer.setdX(0);
                    }
                    else if (distY > 0 && localPlayer.getdY() < 0)//below
                    {
                        localPlayer.setdY(0);
                    }
                    //need to figure out what the primary direction is.
                    if (distX < 0 && localPlayer.getdX() > 0)//left
                    {
                        localPlayer.setdX(0);
                    }
                    else if (distX > 0 && localPlayer.getdX() < 0)//right
                    {
                        localPlayer.setdX(0);
                    }

                    return true;
                }
                if (Math.abs(distX) < localPlayer.getcharW() / 2 + 25 && Math.abs(distY) < localPlayer.getcharH() / 2 + 26)
                {
                    if (distY <= 0 && localPlayer.getdY() > 0)//above
                    {
                        localPlayer.setY(y * 50 - localPlayer.getcharH());
                        localPlayer.setdY(0);
                        localPlayer.setinAir(false);
                        localPlayer.setdX(0);
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