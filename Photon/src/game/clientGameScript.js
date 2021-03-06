/**************************************************
** GAME VARIABLES
**************************************************/
var localPlayer,                // Local player
    remotePlayers;
    
var development = true;

var level = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
             [0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0],
             [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
             [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
             [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
var txt = "";
var c = document.getElementById("myCanvas");
c.height = 720;//level.length * 50;
c.width = 1280;//level[0].length * 50;
var ctx = c.getContext("2d");
ctx.font = '18pt Calibri';
ctx.fillStyle = 'white';
var message = "";
var inputMsg = "";
var imageBG = new Image();
imageBG.src = "http://coolvibe.com/wp-content/uploads/2011/05/monolith.jpg";
var imageObj = new Image();
imageObj.src = 'http://i.imgur.com/nVINE2F.png';
var imageHB = new Image();
imageHB.src = "http://i.imgur.com/dpHHAIC.png";
var imageCH = new Image();
imageCH.src = "https://si0.twimg.com/profile_images/1207225546/crosshairs_normal.png";
var imageBall = new Image();
imageBall.src = "http://www.chronology.org/tokens/gem_purple.gif";
var midCharX = 0;
var midCharY = 0;
var midBoxX = 0;
var midBoxY = 0;
var lastHeartBeat = Date.now();
var localID = -1;
var startX = 0;
var startY = 0;
var cameraMoveRegionX = 300;
var cameraMoveRegionY = 200;
var cameraMoveRegionW = c.width - (cameraMoveRegionX * 2);
var cameraMoveRegionH = c.height - (cameraMoveRegionY * 2);
var cameraOffsetX = 0;
var cameraOffsetY = 0;
var mousePos = {x:0, y:0};
var origin = {x:0, y:0};
var fireballDamage = 20;
var damage = "";
var eid = "";
var id = "";
var lightsOff = false;
var teamOne = {points:0, players:0, captures:0, lastTick:Date.now(), delta:0, playersInTerritory:0};
var teamTwo = {points:0, players:0, captures:0, lastTick:Date.now(), delta:0, playersInTerritory:0};
var teams = [teamOne, teamTwo];
var ball = {x:0, y:0, dx:0, dy:0, spd:0, resetX:0, resetY:0, isHeld:false};
var capPointValue = 25;
        
var oldX = 0;
var oldY = 0;

var RIGHT = 3;
var LEFT = 4;
var NEUTRAL = 5;
var JUMP = 6;
var NAME = 7;
var HIT = 8;
var FIREBALL = 10;
var THROW = 11;
var ENTER = 12;
var EXIT = 13;
var PICKUP = 14;
var DROP = 15;
var CAPTURE = 16;

var distX = midCharX - midBoxX;
var distY = midCharY - midBoxY;

var stats = new Stats();
stats.setMode(2);
document.body.appendChild(stats.domElement);

var enemyVec;
var dist;
var bulletTrajectory;

function vec_mag(vec) { // get the magnitude of the vector
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y); 
}
function vec_sub(a,b) { // subtract two vectors
  return { x: a.x-b.x, y: a.y-b.y };
}
function vec_add(a,b) { // add two vectors
  return { x: a.x + b.x, y: a.y + b.y };
}
function vec_mul(a,c) { // multiply a vector by a scalar
  return { x: a.x * c, y: a.y * c };
}
function vec_div(a,c) { // divide == multiply by 1/c
  return vec_mul(a, 1.0/c);
}
function vec_normal(a) { // normalize vector
  return vec_div(a, vec_mag(a)); 
}


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {

    // Calculate a random start position for the local player
    // The minus 5 (half a player size) stops the player being
    // placed right on the egde of the screen

    for (x = 0; x < level[0].length; x++)
    {
        for (y = 0; y < level.length; y++)
        {
            if (level[y][x] == 2)
            {
                startX = x * 50;
                startY = y * 50;
            }
            else if(level[y][x] == 5)
            {
                ball.x = x * 50;
                ball.y = y * 50;
                ball.resetX = ball.x;
                ball.resetY = ball.y;
            }
        }
    }
    
    cameraOffsetX = c.width/2 - startX;
    cameraOffsetY = c.height/2 - startY;
    // Initialise the local player
    localPlayer = new Player(startX, startY, 'http://www.vgmuseum.com/mrp/cv-sotn/characters/saturn-alucard(2).gif');
    localPlayer.id = localID;
    
    remotePlayers = [];
    // Start listening for events
    setEventHandlers();
    cameraOffsetX -= localPlayer.getcharW()/2;
    cameraOffsetY -= localPlayer.getcharH()/2;
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
            lightsOff = !lightsOff;
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
        case 70://F
            inputMsg = "F";
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
            if (document.getElementById("input").value == "")
            {
                e.preventDefault();
                e.stopPropagation();
                
                if (!localPlayer.getinAir())
                {
                    localPlayer.setinAir(true);
                    localPlayer.setdY(localPlayer.getjumpPower());

                    try {
                        DefaultController.peer.raiseEvent(JUMP, {
                            id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY(), jp: localPlayer.getjumpPower()
                        });
                    } catch (err) {
                        DefaultController.output("error145: " + err.message);
                    }
                }
            }
            break;
        case 27://ESCAPE
            document.getElementById("input").value = "";
            break;
        case 13://RETURN
            document.getElementById("input").focus();
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
            if (!localPlayer.getattacking())
                localPlayer.Attack();
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
        case 70://F
            inputMsg = "F";
            if (!ball.isHeld && Math.sqrt((localPlayer.getX() - ball.x)^2 + (localPlayer.getY() - ball.y)^2) < 10)
            {
                ball.isHeld = true;
                localPlayer.sethasBall(true);
                
                try  {
                    DefaultController.peer.raiseEvent(PICKUP, {
                    id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY()
                    });
                } catch (err) {
                    DefaultController.output("errorPICKUP: " + err.message);
                }
            }
            else if (ball.isHeld && localPlayer.gethasBall())
            {
                ball.isHeld = false;
                localPlayer.sethasBall(false);
                
                try  {
                    DefaultController.peer.raiseEvent(DROP, {
                    id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY()
                    });
                } catch (err) {
                    DefaultController.output("errorDROP: " + err.message);
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
    newPlayer.setid(data.id);
    newPlayer.setteam(data.id%2);
    remotePlayers.push(newPlayer);
};

function onRemovePlayer(data)
{
    var removePlayer = playerById(data.id);
    
    for (i = 0; i < remotePlayers.length; i++)
    {
        if (removePlayer.getid() == remotePlayers[i].getid())
            remotePlayers.splice(i,1);
    }
}

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

function onJumpPlayer(data) {
    var jumpPlayer = playerById(data.id);
    
    if (!jumpPlayer) {
        console.log("jumpPlayer not found: " + data.id);
    }
    
    jumpPlayer.setX(data.x);
    jumpPlayer.setY(data.y);
    jumpPlayer.setinAir(true);
    jumpPlayer.setdY(jumpPlayer.getjumpPower());
};

function onNamePlayer(data) {
    var namePlayer = playerById(data.id);
    
    if (!namePlayer) {
        console.log("jumpPlayer not found: " + data.id);
    }
    
    namePlayer.setname(data.name);
};

function onHitPlayerWithFireball(data) {
    var attackingPlayer = playerById(parseInt(data.eid));
    
    if (!attackingPlayer) {
        console.log("attackingPlayer not found: " + data.eid);
    }
    else
    {
        var fb = attackingPlayer.getfireball();
        fb.active = false;
        attackingPlayer.setfireball(fb);
    }
    
    if (localPlayer.getid() == parseInt(data.id))
    {
        localPlayer.TakeDamage(parseInt(data.dmg));
    }
    else
    {
        var hitPlayer = playerById(parseInt(data.id));
        if (!hitPlayer) {
            DefaultController.output("hitPlayerWithFireball not found: " + data.id);
        }
        hitPlayer.TakeDamage(parseInt(data.dmg));
    }
};

function onPlayerPickupBall(data) {
    var pickingPlayer = playerById(parseInt(data.id));
    
    if (!pickingPlayer) {
        console.log("pickingPlayer not found: " + data.id);
    }
    
    pickingPlayer.sethasBall(true);
    ball.isHeld = true;
};

function onPlayerCapture(data) {
    var cappingPlayer = playerById(parseInt(data.id));
    
    if (!cappingPlayer) {
        console.log("cappingPlayer not found: " + data.id);
    }
    
    CaptureBall(parseInt(data.team));
};

function onPlayerDropBall(data) {
    var droppingPlayer = playerById(parseInt(data.id));
    
    if (!droppingPlayer) {
        console.log("droppingPlayer not found: " + data.id);
    }
    
    droppingPlayer.sethasBall(false);
    ball.isHeld = false;
};

function onPlayerThrewFireball(data) {
    var attackingPlayer = playerById(parseInt(data.eid));
    
    if (!attackingPlayer) {
        console.log("attackingPlayer not found: " + data.eid);
    }
    else
    {
        ThrowProjectileAt(attackingPlayer, ({x: data.mx, y: data.my}));
    }
};

function onPlayerEnteredZone(data) {
    if (teams[parseInt(data.team)].playersInTerritory == 0)
    {
        teams[parseInt(data.team)].lastTick = Date.now();
    }
    teams[parseInt(data.team)].playersInTerritory++;
}

function onPlayerExitedZone(data) {
    teams[parseInt(data.team)].playersInTerritory--;
}

function onHitPlayer(data) {
    var attackingPlayer = playerById(parseInt(data.eid));
    
    if (!attackingPlayer) {
        console.log("attackingPlayer not found: " + data.eid);
    }
    else
    {
        attackingPlayer.Attack();
    }
    
    if (localPlayer.getid() == parseInt(data.id))
    {
        localPlayer.TakeDamage(parseInt(data.dmg));
    }
    else
    {
        var hitPlayer = playerById(parseInt(data.id));
        if (!hitPlayer) {
            DefaultController.output("hitPlayer not found: " + data.id);
        }
        hitPlayer.TakeDamage(parseInt(data.dmg));
    }
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
    
//    if (localPlayer.getteam() == -1)
        localPlayer.setteam(localPlayer.getid()%2);
    
    for (i = 0; i < remotePlayers.length; i++) {
//        if (remotePlayers[i].getteam() == -1)
            remotePlayers[i].setteam(remotePlayers[i].getid()%2);
    };
    
    for (i = 0; i < teams.length; i++)
    {
        if (teams[i].playersInTerritory > 0)
        {
            teams[i].delta = 1;
            if (teams[i].lastTick + 1000 < Date.now())
            {
                teams[i].points += teams[i].delta;
                teams[i].lastTick = Date.now();
            }
        }
        else
        {
            teams[i].delta = 0;
        }
    }
    
    ctx.translate(cameraOffsetX, cameraOffsetY);
    cameraOffsetX = 0;
    cameraOffsetY = 0;
    
    oldX = localPlayer.getX();
    oldY = localPlayer.getY();
    
    updateMovement(localPlayer);
    
    if (ball.isHeld)
    {
        if (localPlayer.gethasBall())
        {
            if (!localPlayer.getdead())
            {
                ball.x = localPlayer.getX() + localPlayer.getcharW()/2;
                ball.y = localPlayer.getY() + localPlayer.getcharH()/4;
            }
            else
            {
                ball.isHeld = false;
                localPlayer.sethasBall(false);
                
                try  {
                    DefaultController.peer.raiseEvent(DROP, {
                    id: localPlayer.getid(), x: localPlayer.getX(), y: localPlayer.getY()
                    });
                } catch (err) {
                    DefaultController.output("errorDROP: " + err.message);
                }
            }
        }
    }
    
    for (i = 0; i < remotePlayers.length; i++)
    {
        if (ball.isHeld)
        {
            if (remotePlayers[i].gethasBall() && !remotePlayers[i].getdead())
            {
                ball.x = remotePlayers[i].getX() + remotePlayers[i].getcharW()/2 + remotePlayers[i].getdX();
                ball.y = remotePlayers[i].getY() + remotePlayers[i].getcharH()/4 + remotePlayers[i].getdY();
            }
        }
        
        updateMovement(remotePlayers[i]);
        
        damage = localPlayer.DidAttackHit(remotePlayers[i]) + "";
        if (damage != -1)
        {
            eid = remotePlayers[i].getid() + "";
            id = localPlayer.getid() + "";
            try  {
                DefaultController.peer.raiseEvent(HIT, {
                    dmg : damage, id : id, enemyid : eid
                });
            } catch (err) {
                DefaultController.output("errorHit: " + err.message + "; dmg: " + damage);
            }
        }
        else if (damage == 0)
        {
            eid = remotePlayers[i].getid() + "";
            id = localPlayer.getid() + "";
            try  {
                DefaultController.peer.raiseEvent(HIT, {
                    dmg : 0, id : id, enemyid : eid
                });
            } catch (err) {
                DefaultController.output("errorHit: " + err.message + "; dmg: " + damage);
            }
        }
    };
    
    ctx.clearRect(-600, -600, level[0].length * 50 + 1600, level.length * 50 + 1600);
    drawWorld();
    
    if (teams[0].captures >= 3 || teams[1].captures >= 3)
        Reset();
    
    cameraOffsetX = oldX - localPlayer.getX();
    cameraOffsetY = oldY - localPlayer.getY();

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
        if (player.getdX() > 0)
            player.setdX(player.getdX() - 0.125);
        else if (player.getdX() < 0)
            player.setdX(player.getdX() + 0.125);
        else
        {
        }
        player.setdY(player.getdY() + 0.25);
    }

//    localPlayer.setdX(Math.floor(localPlayer.getdX() * 100) / 100);
//    localPlayer.setdY(Math.floor(localPlayer.getdY() * 100) / 100);
    
    if (!player.getdead())
    {
        player.setX(Math.floor(player.getX() + player.getdX() * player.getspd()));
        if (player.getinAir())
            player.setY(player.getY() + player.getdY());
    }
    else
    {
        player.setX(player.getrespawnX());
        player.setY(player.getrespawnY());
    }
    
    if (player.getfireball().active)
    {
        player.getfireball().x += player.getfireball().dx;
        player.getfireball().y += player.getfireball().dy;
        
        for (i = 0; i < remotePlayers.length; i++)
        {
            if ((player.getfireball().x >= remotePlayers[i].getX() && player.getfireball().x <= remotePlayers[i].getX() + remotePlayers[i].getcharW()) &&
                (player.getfireball().y >= remotePlayers[i].getY() && player.getfireball().y <= remotePlayers[i].getY() + remotePlayers[i].getcharH()))
            {
                if (player.getid() == remotePlayers[i].getid())
                    continue;
                player.getfireball().active = false;
                remotePlayers[i].TakeDamage(fireballDamage);
                damage = fireballDamage + "";
                eid = remotePlayers[i].getid() + "";
                id = player.getid() + "";
                
                try  {
                    DefaultController.peer.raiseEvent(FIREBALL, {
                        dmg : damage, id : id, enemyid : eid
                    });
                } catch (err) {
                    DefaultController.output("errorHit: " + err.message + "; dmg: " + damage);
                }
                
                break;
            }
        };
        
        if (vec_mag(vec_sub(origin, {x:player.getfireball().x, y:player.getfireball().y})) >= player.getfireball().rng)
            player.getfireball().active = false;
    }
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
    if (player.getX() + 1 * player.getspd() > level[0].length * 50 - player.getcharW())
    {
        if (player.getdX() > 0)
            player.setdX(0);
    }
    if (player.getY() - 1 * player.getspd() > level.length * 50 - player.getcharH())
    {
        player.setY(c.height - player.getcharH());
    }
    
    var inZone = false;

    for (x = 0; x < level[0].length; x++)
    {
        for (y = 0; y < level.length; y++)
        {
            if (level[y][x] == 3 || level[y][x] == 1 || level[y][x] == 4)
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
                
                if (level[y][x] == 4 && player.gethasBall())
                {
                    if (Math.abs(distX) < player.getcharW() / 2 + 25 && Math.abs(distY) < player.getcharH() / 2 + 25)
                    {
                        CaptureBall(player.getteam());
                        
                        id = player.getid() + "";
                        teamStr = player.getteam() + "";

                        try  {
                            DefaultController.peer.raiseEvent(CAPTURE, {
                                id : id, team : teamStr
                            });
                        } catch (err) {
                            DefaultController.output("errorCapture: " + err.message);
                        }
                    }
                }
                
                if (level[y][x] == 3)
                {
                    if (Math.abs(distX) < player.getcharW() / 2 + 25 && Math.abs(distY) < player.getcharH() / 2 + 25)
                    {
                        if (distY <= 0)//above
                        {
                            inZone = true;
                        }
                        if (distX < 0)//left
                        {
                            inZone = true;
                        }
                    }
                }
                if (level[y][x] == 1)
                {
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

                        if (inZone)
                        {
//                            if (teams[player.getteam()].delta == 0)
//                            {
//                                teams[player.getteam()].lastTick = Date.now();
//                            }
                            if (!player.getinZone())
                            {
                                if (teams[player.getteam()].playersInTerritory == 0)
                                    teams[player.getteam()].lastTick = Date.now();
                                //Enter event
                                id = player.getid() + "";
                                teamStr = player.getteam() + "";
                                now = Date.now() + "";
                                
                                try  {
                                    DefaultController.peer.raiseEvent(ENTER, {
                                        id : id, team : teamStr, time : now
                                    });
                                } catch (err) {
                                    DefaultController.output("errorEnter: " + err.message);
                                }
                                teams[player.getteam()].playersInTerritory++;
                                player.setinZone(true);
                            }
                        }
                        else
                        {
                            if (player.getinZone())
                            {
                                //Exit event
                                id = player.getid() + "";
                                teamStr = player.getteam() + "";
                                
                                try  {
                                    DefaultController.peer.raiseEvent(EXIT, {
                                        id : id, team : teamStr
                                    });
                                } catch (err) {
                                    DefaultController.output("errorExit: " + err.message);
                                }
                                teams[player.getteam()].playersInTerritory--;
                                player.setinZone(false);
                            }
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

                        if (inZone)
                        {
//                            if (teams[player.getteam()].delta == 0)
//                            {
//                                teams[player.getteam()].lastTick = Date.now();
//                            }
                            if (!player.getinZone())
                            {
                                if (teams[player.getteam()].playersInTerritory == 0)
                                    teams[player.getteam()].lastTick = Date.now();
                                //Enter event
                                id = player.getid() + "";
                                teamStr = player.getteam() + "";
                                now = Date.now() + "";
                                
                                try  {
                                    DefaultController.peer.raiseEvent(ENTER, {
                                        id : id, team : teamStr, time : now
                                    });
                                } catch (err) {
                                    DefaultController.output("errorEnter: " + err.message);
                                }
                                teams[player.getteam()].playersInTerritory++;
                                player.setinZone(true);
                            }
                        }
                        else
                        {
                            if (player.getinZone())
                            {
                                //Exit event
                                id = player.getid() + "";
                                teamStr = player.getteam() + "";
                                
                                try  {
                                    DefaultController.peer.raiseEvent(EXIT, {
                                        id : id, team : teamStr
                                    });
                                } catch (err) {
                                    DefaultController.output("errorExit: " + err.message);
                                }
                                teams[player.getteam()].playersInTerritory--;
                                player.setinZone(false);
                            }
                        }
                        return true;
                    }
                }
            }
        }
    }
    
    if (player.getinZone())
    {
        //Exit event
        id = player.getid() + "";
        teamStr = player.getteam() + "";

        try  {
            DefaultController.peer.raiseEvent(EXIT, {
                id : id, team : teamStr
            });
        } catch (err) {
            DefaultController.output("errorExit: " + err.message);
        }
        teams[player.getteam()].playersInTerritory--;
        player.setinZone(false);
    }

    return false;
};

function drawWorld() {
//    ctx.drawImage(imageBG, c.width / 2 - 960, c.height / 2 - 400);
    ctx.fillStyle = "rgba(255, 153, 51, 1)";
    ctx.fillRect(0, 0, level[0].length * 50/3, level.length * 50);//above
    ctx.fillStyle = "rgba(192, 192, 192, 1)";
    ctx.fillRect(level[0].length * 50/3, 0, level[0].length * 50/3, level.length * 50);//above
    ctx.fillStyle = "rgba(0, 255, 255, 1)";
    ctx.fillRect(level[0].length * 50/3*2, 0, level[0].length * 50/3, level.length * 50);//above
//    102 51 0  orange
//    0 51 102  blue
    for (x = 0; x < level[0].length; x++)
    {
        for (y = 0; y < level.length; y++)
        {
            if (level[y][x] == 1)
            {
                ctx.drawImage(imageObj, x * 50, y * 50);
            }
            else if (level[y][x] == 3)
            {
                var my_gradient=ctx.createLinearGradient(x*50,y*50,x*50,y*50+50);
                my_gradient.addColorStop(0,"rgba(0, 0, 0, 0)");//just for transparency
                if (teams[0].playersInTerritory > 0 && teams[1].playersInTerritory > 0)
                {
                    my_gradient.addColorStop(1,"rgba(0, 102, 0, 1)");
                }
                else if (teams[0].playersInTerritory > 0)
                {
                    my_gradient.addColorStop(1,"rgba(0, 51, 102, 1)");
                }
                else if (teams[1].playersInTerritory > 0)
                {
                    my_gradient.addColorStop(1,"rgba(102, 51, 0, 1)");
                }
                else
                {
                    my_gradient.addColorStop(1,"rgba(160, 160, 160, 1)");
                }
                ctx.fillStyle=my_gradient;
                ctx.fillRect(x*50,y*50,50,50);
            }
            else if (level[y][x] == 4)
            {
                var my_gradient=ctx.createLinearGradient(x*50,y*50,x*50,y*50+50);
                my_gradient.addColorStop(0,"rgba(0, 0, 0, 0)");//just for transparency
                my_gradient.addColorStop(1,"rgba(255, 255, 51, 1)");
                ctx.fillStyle=my_gradient;
                ctx.fillRect(x*50,y*50,50,50);
            }
        }
    } 
    
    if (lightsOff)
    {
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(0, 0, level[0].length * 50, level.length * 50);//above
    }
    
    ctx.fillStyle="#000000";
    ctx.fillRect(localPlayer.getX() + localPlayer.getcharW()/2 - 52, localPlayer.getY() - 17, 104, 14);
    ctx.drawImage(imageHB, 0, 0, 10, 10, localPlayer.getX() + localPlayer.getcharW()/2 - 50, localPlayer.getY() - 15, 100, 10);
    ctx.drawImage(imageHB, 0, 16, 10, 10, localPlayer.getX() + localPlayer.getcharW()/2 - 50, localPlayer.getY() - 15, localPlayer.getcurrHealth(), 10);
    
    localPlayer.draw(ctx);
//    ctx.fillRect(0, localPlayer.getY() + localPlayer.getcharH()+10, level[0].length * 50, level[0].length * 50-localPlayer.getY() + localPlayer.getcharH());//below
//    if (localPlayer.getright())
//    {
//        ctx.fillRect(0, 
//                localPlayer.getY() - 40, 
//                localPlayer.getX(), 
//                localPlayer.getcharH() + 50);//left
//        ctx.fillRect(localPlayer.getX() + localPlayer.getcharW() + 400, 
//                localPlayer.getY() - 40, 
//                level[0].length * 50 - (localPlayer.getX() + localPlayer.getcharW() + 400), 
//                localPlayer.getcharH() + 50);//right
//    }
//    else
//    {
//        ctx.fillRect(0, 
//                localPlayer.getY() - 40, 
//                localPlayer.getX() - 400, 
//                localPlayer.getcharH() + 50);//left
//        ctx.fillRect(localPlayer.getX() + localPlayer.getcharW(), 
//                localPlayer.getY() - 40, 
//                level[0].length * 50 - (localPlayer.getX() + localPlayer.getcharW()), 
//                localPlayer.getcharH() + 50);//right
//    }
    
    var i;
     
    if (lightsOff)
    { 
        ctx.save();
        ctx.beginPath();

        enemyVec = vec_sub(mousePos, {x:c.width/2, y:c.height/2});
        lightTrajectory = vec_mul(vec_normal(enemyVec), 2);

        ctx.fillStyle = "rgba(255, 255, 153, 0.5)";
        ctx.arc(localPlayer.getX()+localPlayer.getcharW()/2 + (100 * lightTrajectory.x), localPlayer.getY() + localPlayer.getcharH()/3 + (100 * lightTrajectory.y), 50, 0, 2 * Math.PI, false);
        ctx.arc(localPlayer.getX()+localPlayer.getcharW()/2 + (80 * lightTrajectory.x), localPlayer.getY() + localPlayer.getcharH()/3 + (80 * lightTrajectory.y), 43, 0, 2 * Math.PI, false);
        ctx.arc(localPlayer.getX()+localPlayer.getcharW()/2 + (60 * lightTrajectory.x), localPlayer.getY() + localPlayer.getcharH()/3 + (60 * lightTrajectory.y), 36, 0, 2 * Math.PI, false);
        ctx.arc(localPlayer.getX()+localPlayer.getcharW()/2 + (40 * lightTrajectory.x), localPlayer.getY() + localPlayer.getcharH()/3 + (40 * lightTrajectory.y), 28, 0, 2 * Math.PI, false);
        ctx.arc(localPlayer.getX()+localPlayer.getcharW()/2 + (20 * lightTrajectory.x), localPlayer.getY() + localPlayer.getcharH()/3 + (20 * lightTrajectory.y), 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.clip();
    }
    
    for (i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    };
    
    if (lightsOff)
    {
        ctx.fill();
    }
    
    ctx.fillStyle="#000000";
    for (i = 0; i < remotePlayers.length; i++) {
        ctx.fillRect(remotePlayers[i].getX() + remotePlayers[i].getcharW()/2 - 52, remotePlayers[i].getY() - 17, 104, 14);
        ctx.drawImage(imageHB, 0, 0, 10, 10, remotePlayers[i].getX() + remotePlayers[i].getcharW()/2 - 50, remotePlayers[i].getY() - 15, 100, 10);
        ctx.drawImage(imageHB, 0, 16, 10, 10, remotePlayers[i].getX() + remotePlayers[i].getcharW()/2 - 50, remotePlayers[i].getY() - 15, remotePlayers[i].getcurrHealth(), 10);
    };
    
    ctx.drawImage(imageBall, 0, 0, 16, 16, ball.x, ball.y, 20, 20);
    
    if (lightsOff)
    {
        ctx.restore();
    }
    
    writeMessage();
};

function writeMessage() {
    ctx.fillStyle="#FFFFFF";
//    ctx.fillText(localPlayer.getX() + " " + localPlayer.getY(), 10, 25);
    var teamName = "";
    
    if (localPlayer.getteam() == 0)
    {
        teamName = "<BLUE>";
    }
    else if (localPlayer.getteam() == 1)
    {
        teamName = "<ORANGE>";
    }
    ctx.fillText(teamName, localPlayer.getX() + localPlayer.getcharW()/2 - ((6 + localPlayer.getteam())*teamName.length), localPlayer.getY() - 20);
//    ctx.fillText(localPlayer.getid(), localPlayer.getX() + localPlayer.getcharW()/2 - (6*localPlayer.getname().length), localPlayer.getY() - 40);

    for (i = 0; i < teams.length; i++) {
        if (i == 0)
        {
            teamName = "<BLUE>";
        }
        else if (i == 1)
        {
            teamName = "<ORANGE>";
        }
        ctx.fillText("Team " + teamName + ": " + teams[i].points + " - Caps: " + teams[i].captures, localPlayer.getX()-570, localPlayer.getY() - 235 + i*30);
    };
    
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].getteam() == 0)
        {
            teamName = "<BLUE>";
        }
        else if (remotePlayers[i].getteam() == 1)
        {
            teamName = "<ORANGE>";
        }
        ctx.fillText(teamName, remotePlayers[i].getX() + remotePlayers[i].getcharW()/2 - ((6 + remotePlayers[i].getteam())*teamName.length), remotePlayers[i].getY() - 20);
//        ctx.fillText(remotePlayers[i].getid(), remotePlayers[i].getX() + remotePlayers[i].getcharW()/2 - (6*remotePlayers[i].getname().length), remotePlayers[i].getY() - 40);
    };
}

function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left-8,
        y: evt.clientY - rect.top-7
    };
}

c.onclick = function() {
    ThrowProjectile(localPlayer);
};

c.ondblclick = function() {
    //prevents highlighting
};

//c.on('click', function(e) {
//    e.preventDefault();
//    
//    ThrowProjectile(localPlayer);
//    
//    return true;
//});

function ThrowProjectile(player)
{
    if (!player.getfireball().active && !player.getdead())
    {
        player.getfireball().active = true;
        player.getfireball().x = player.getX();
        player.getfireball().y = player.getY();
        enemyVec = vec_sub(mousePos, {x:c.width/2 - player.getcharW()/2, y:c.height/2 - player.getcharH()/2});
        bulletTrajectory = vec_mul(vec_normal(enemyVec), player.getfireball().spd);
        // assign values
        player.getfireball().dx = bulletTrajectory.x;
        player.getfireball().dy = bulletTrajectory.y;
        
        origin = {x:player.getX() + player.getcharW()/2, y:player.getY() + player.getcharH()/2};
        
        id = player.getid() + "";

        try  {
            DefaultController.peer.raiseEvent(THROW, {
                id : id, mx: mousePos.x, my: mousePos.y
            });
        } catch (err) {
            DefaultController.output("errorHit: " + err.message + "; dmg: " + damage);
        }
    }
}

function ThrowProjectileAt(player, distinationPoint)
{
    if (!player.getfireball().active && !player.getdead())
    {
        player.getfireball().active = true;
        player.getfireball().x = player.getX();
        player.getfireball().y = player.getY();
        enemyVec = vec_sub(distinationPoint, {x:c.width/2 - player.getcharW()/2, y:c.height/2 - player.getcharH()/2});
        bulletTrajectory = vec_mul(vec_normal(enemyVec), player.getfireball().spd);
        // assign values
        player.getfireball().dx = bulletTrajectory.x;
        player.getfireball().dy = bulletTrajectory.y;
        
        origin = {x:player.getX() + player.getcharW()/2, y:player.getY() + player.getcharH()/2};
    }
}

c.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(c, evt);
    message = mousePos.x + ',' + mousePos.y;
}, false);

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].getid() == id)
            return remotePlayers[i];
    };

    return false;
};

function Reset()
{
    for (i = 0; i < teams.length; i++)
    {
        teams[i].points = 0;
        teams[i].captures = 0;
        teams[i].playersInTerritory = 0;
        teams[i].lastTick = Date.now();
    }
    
    localPlayer.setcurrHealth(localPlayer.getmaxHealth());
    localPlayer.setX(localPlayer.getrespawnX());
    localPlayer.setY(localPlayer.getrespawnY());
    localPlayer.setinZone(false);
    
    for (i = 0; i < remotePlayers.length; i++)
    {
        remotePlayers[i].setcurrHealth(remotePlayers[i].getmaxHealth());
        remotePlayers[i].setX(remotePlayers[i].getrespawnX());
        remotePlayers[i].setY(remotePlayers[i].getrespawnY());
        remotePlayers[i].setinZone(false);
    }
    
    ResetBall();
}

function ResetBall()
{
    localPlayer.sethasBall(false);
    
    for (i = 0; i < remotePlayers.length; i++)
    {
        remotePlayers[i].sethasBall(false);
    }
    
    ball.isHeld = false;
    ball.x = ball.resetX;
    ball.y = ball.resetY;
}

function CaptureBall(teamIndex)
{
    teams[teamIndex].captures++;
    teams[teamIndex].points += capPointValue;
    
    ResetBall();
}

/**************************************************
** GAME DRAW
**************************************************/
function draw() {
    // Draw the local player
};// this is a "constant"  - representing 10px motion per "time unit"

/// <reference path="Photon/Photon-Javascript_SDK.d.ts"/>
var PhotonServerAddress = "24.149.29.78:9090";
var DefaultController = (function () {
    function DefaultController() { }
    DefaultController.logger = new Exitgames.Common.Logger("Demo:");
    DefaultController.setupUI = function setupUI() {
        this.logger.info("Setting up UI.");
        var input = document.getElementById("input");
        input.value = '';
//        input.focus();
        var form = document.getElementById("mainfrm");
        form.onsubmit = function () {
            var input = document.getElementById("input");
            if (String(input.value).indexOf("/name ") != -1)
            {
                var name = "";
                if (String(input.value).length > 17)
                {
                    name = String(input.value).substr(6, 11);
                }
                else
                {
                    name = String(input.value).substring(6, String(input.value).length);
                }
                localPlayer.setname(name);
                try  {
                    DefaultController.peer.raiseEvent(NAME, {
                        id : localPlayer.getid(), x : localPlayer.getX(), y : localPlayer.getY(), name : name
                    });
                    DefaultController.output('name me[' + DefaultController.peer.myActor().photonId + ']: ' + name);
                } catch (err) {
                    DefaultController.output("errorName: " + err.message);
                }
            }
            else
            {
                try  {
                    DefaultController.peer.raiseEvent(1, {
                        message: String(input.value)
                    });
                    DefaultController.output('me[' + DefaultController.peer.myActor().photonId + ']: ' + input.value);
                } catch (err) {
                    DefaultController.output("error565: " + err.message);
                }
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
            DefaultController.output('I joined with id: [' + e.actorNr + '].');
            localPlayer.setid(e.actorNr);
            localPlayer.setteam(e.actorNr%2);
        });
        DefaultController.peer.addEventListener(Photon.Lite.Constants.LiteEventCode.Join, function (e) {
            for(var i = 0; i < e.newActors.length; i++) {
                if(e.newActors[i] != DefaultController.peer.myActor().photonId) {
                    onNewPlayer({id: e.newActors[i], x: startX, y: startY});
                    DefaultController.output('actor[' + e.newActors[i] + '] joined!');
                }
            }
        });
        DefaultController.peer.addEventListener(Photon.Lite.Constants.LiteEventCode.Leave, function (e) {
            DefaultController.output('actor[' + e.actorNr + '] left!');
            onRemovePlayer({id:e.actorNr});
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
        DefaultController.peer.addEventListener(JUMP, function (data) {
            var dataid = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datax  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].x;
            var datay  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].y;
            var datajp = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].jp;
            onJumpPlayer({id : dataid, x : datax, y : datay, jp : datajp});
        });
        DefaultController.peer.addEventListener(NAME, function (data) {
            var dataid = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datax  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].x;
            var datay  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].y;
            var dataname = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].name;
            onNamePlayer({id : dataid, x : datax, y : datay, name : dataname});
            DefaultController.output('actor[' + actorNr + '] - named: ' + dataname);
        });
        DefaultController.peer.addEventListener(HIT, function (data) {
            var datadmg = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].dmg;
            var dataid  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var dataenemyid = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].enemyid;
            onHitPlayer({dmg : datadmg, eid : dataid, id : dataenemyid});
        });
        DefaultController.peer.addEventListener(FIREBALL, function (data) {
            var datadmg = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].dmg;
            var dataid  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var dataenemyid = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].enemyid;
            onHitPlayerWithFireball({dmg : datadmg, eid : dataid, id : dataenemyid});
        });
        DefaultController.peer.addEventListener(THROW, function (data) {
            var dataid  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datamx  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].mx;
            var datamy = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].my;
            onPlayerThrewFireball({eid : dataid, mx : datamx, my : datamy});
        });
        DefaultController.peer.addEventListener(ENTER, function (data) {
            var dataid  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datateam  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].team;
            var datatime  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].time;
            onPlayerEnteredZone({id : dataid, team : datateam, time : datatime});
        });
        DefaultController.peer.addEventListener(EXIT, function (data) {
            var dataid  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datateam  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].team;
            onPlayerExitedZone({id : dataid, team : datateam});
        });
        DefaultController.peer.addEventListener(PICKUP, function (data) {
            var dataid  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datamx  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].mx;
            var datamy = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].my;
            onPlayerPickupBall({id : dataid, mx : datamx, my : datamy});
        });
        DefaultController.peer.addEventListener(DROP, function (data) {
            var dataid  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datamx  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].mx;
            var datamy = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].my;
            onPlayerDropBall({id : dataid, mx : datamx, my : datamy});
        });
        DefaultController.peer.addEventListener(CAPTURE, function (data) {
            var dataid  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].id;
            var datateam  = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].team;
            onPlayerCapture({id : dataid, team : datateam});
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
