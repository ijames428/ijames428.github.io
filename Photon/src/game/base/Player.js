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
    var imgCharRight = new Image();
    imgCharRight.src = "http://www.vgmuseum.com/mrp/cv-sotn/characters/saturn-alucard(2).gif";
    var imgCharLeft = new Image();
    imgCharLeft.src = "http://i.imgur.com/qG7Auir.gif";
    var imgAtk = new Image();
    var imgAtkRight = new Image();
    imgAtkRight.src = "http://i.imgur.com/9Wc6P9M.gif";
    var imgAtkLeft = new Image();
    imgAtkLeft.src = "http://i.imgur.com/W2zoWjc.gif";
    var jumpPower = -11;
    var maxHealth = 100;
    var currHealth = 100;
    var attacking = false;
    var attackTime = Date.now();
    var right = true;
    var hitBoxRange = 84;
    var dealtDamage = false;
    var dead = false;
    var damage = 10;
    var deathTimer = 5000;
    var deathTime = 0;
    
    var imageFB = new Image();
    imageFB.src = "http://images2.wikia.nocookie.net/__cb20111225172543/nitrome/images/8/88/FireballS.png";
    var fireball = {x:0,y:0,dx:0,dy:0,active:false,spd:30,rng:550};
    
    var x = startX,
        y = startY,
        id = 0,
        moveAmount = 2;

    var getX = function() {return x;};
    var getY = function() {return y;};
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
    var getmaxHealth = function() { return maxHealth; };
    var getcurrHealth = function() { return currHealth; };
    var getattacking = function() { return attacking; };
    var getright = function() { return right; };
    var gethitBoxRange = function() { return hitBoxRange; };
    var getdealtDamage = function() { return dealtDamage; };
    var getdead = function() { return dead; };
    var getfireball = function() { return fireball; };
    var setX = function(newX) {x = newX;};
    var setY = function(newY) {y = newY;};
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
    var setfireball = function(input) { fireball = input; };
    var setjumpPower = function(input) { jumpPower = input; };
    var setmaxHealth = function(input) { maxHealth = input; };
    var setcurrHealth = function(input) { currHealth = input; };
    var setattacking = function(input) {attacking = input;};
    var setdealtDamage = function(input) {dealtDamage = input;};
    
    var update = function() {};
    
    var TakeDamage = function(dmg) 
    {
        if (!dead)
        {
            if (currHealth - dmg > 0)
                currHealth -= dmg;
            else
            {
                currHealth = 0;
                dead = true;
                deathTime = Date.now();
            }
        }
    };
    
    var DidAttackHit = function(enemy)
    {
        if (attacking && !dealtDamage && !enemy.getdead())
        {
            var dmg = -1;
            if (right)
            {
                if ((enemy.getX() > x + charW && enemy.getX() + enemy.getcharW()/2 < x + charW + hitBoxRange) &&
                    (enemy.getY() + enemy.getcharH() > y && enemy.getY() < y + charH/2))
                {
                    if (enemy.getright())
                    {
                        dmg = damage * 2;
                        enemy.TakeDamage(dmg);
                    }
                    else
                    {
                        dmg = damage;
                        enemy.TakeDamage(dmg);
                    }
                    dealtDamage = true;
                }
            }
            else
            {
                if ((enemy.getX() + enemy.getcharW()/2 > x - hitBoxRange && enemy.getX() + enemy.getcharW()/2 < x) &&
                    (enemy.getY() + enemy.getcharH() > y && enemy.getY() < y + charH/2))
                {
                    if (!enemy.getright())
                    {
                        dmg = damage * 2;
                        enemy.TakeDamage(dmg);
                    }
                    else
                    {
                        dmg = damage;
                        enemy.TakeDamage(dmg);
                    }
                    dealtDamage = true;
                }
            }
            if (dealtDamage == false)
            {
                return 0;
            }
            return dmg;
        }
        
        return -1;
    };
    
    var Attack = function() 
    {
        attacking = true;
        attackTime = Date.now();
    };
    
    var Revive = function()
    {
        currHealth = maxHealth;
        x = 400;
        y = 300;
        dead = false;
    }

    var draw = function(ctx) {
        if (dX > 0)
        {
            right = true;
            imgChar = imgCharRight;
            imgAtk = imgAtkRight;
        }
        else if (dX < 0)
        {
            right = false;
            imgChar = imgCharLeft;
            imgAtk = imgAtkLeft;
        }
        if (attacking)
        {
            if (Date.now() > attackTime + 150)
            {
                attacking = false;
                dealtDamage = false;
            }
            if (right)
                ctx.drawImage(imgAtk, x, y, charW * 2, charH);
            else
                ctx.drawImage(imgAtk, x - 60, y, charW * 2, charH);
        }
        else if (dead)
        {
            ctx.fillText((Date.now() - deathTime - (Date.now() - deathTime) % 100)/1000, x + charW/2-3, y+charH/2);
            if (Date.now() - deathTime > deathTimer)
            {
                Revive();
            }
        }
        else
            ctx.drawImage(imgChar, x, y);
        
        if (fireball.active)
            ctx.drawImage(imageFB, fireball.x, fireball.y, 10, 10);
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
            getid: getid,
            getmaxHealth: getmaxHealth,
            getcurrHealth: getcurrHealth,
            getattacking: getattacking,
            getright: getright,
            gethitBoxRange: gethitBoxRange,
            getdealtDamage: getdealtDamage,
            getdead: getdead,
            getfireball: getfireball,
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
            setid: setid,
            setjumpPower:setjumpPower,
            setmaxHealth: setmaxHealth,
            setcurrHealth: setcurrHealth,
            setattacking: setattacking,
            setdealtDamage: setdealtDamage,
            Attack: Attack,
            DidAttackHit: DidAttackHit,
            TakeDamage: TakeDamage,
            Revive: Revive,
            setfireball: setfireball,
    };
};
