/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, imgSrc) {
    var Wdown = false;
    var Adown = false;
    var Sdown = false;
    var Ddown = false;
    var name = "";
    var inAir = true;
    var charW = 58;
    var charH = 98;
    var dX = 0;
    var dY = 0;
    var spd = 4;
    var imgChar = new Image();
    imgChar.src = imgSrc;
    var jumpPower = -11;
    
    var x = startX,
        y = startY,
        id,
        moveAmount = 2;

    var getWdown = function() { return Wdown; };
    var getAdown = function() { return Adown; };
    var getSdown = function() { return Sdown; };
    var getDdown = function() { return Ddown; };
    var getname = function() { return name; };
    var getinAir = function() { return inAir; };
    var getcharW = function() { return charW; };
    var getcharH = function() { return charH; };
    var getdX = function() { return dX; };
    var getdY = function() { return dY; };
    var getspd = function() { return spd; };
    var getid = function() { return id; };
    var getjumpPower = function() { return jumpPower; };
    var setWdown = function(input) { Wdown = input; };
    var setAdown = function(input) { Adown = input; };
    var setSdown = function(input) { Sdown = input; };
    var setDdown = function(input) { Ddown = input; };
    var setname = function(input) { name = input; };
    var setinAir = function(input) { inAir = input; };
    var setcharW = function(input) { charW = input; };
    var setcharH = function(input) { charH = input; };
    var setdX = function(input) { dX = input; };
    var setdY = function(input) { dY = input; };
    var setspd = function(input) { spd = input; };
    var setid = function(input) { id = input; };
    var setjumpPower = function(input) { jumpPower = input; };

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    var update = function() {

    };

    var draw = function(ctx) {
//        console.log(id + " " + x + " " + y);
        ctx.drawImage(imgChar, x, y);
//        ctx.fillRect(id, 10, 10);
//        ctx.fillText(x + " " + y, 10, 25);
    };

    return {
            getX: getX,
            getY: getY,
            setX: setX,
            setY: setY,
            update: update,
            draw: draw,
            getWdown:getWdown,
            getAdown:getAdown,
            getSdown:getSdown,
            getDdown:getDdown,
            getname:getname,
            getinAir:getinAir,
            getcharW:getcharW,
            getcharH:getcharH,
            getdX:getdX,
            getdY:getdY,
            getspd:getspd,
            getjumpPower:getjumpPower,
            setWdown:setWdown,
            setAdown:setAdown,
            setSdown:setSdown,
            setDdown:setDdown,
            setname:setname,
            setinAir:setinAir,
            setcharW:setcharW,
            setcharH:setcharH,
            setdX:setdX,
            setdY:setdY,
            setspd:setspd,
            getid: getid,
            setjumpPower:setjumpPower
    }
};
