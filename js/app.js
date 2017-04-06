//******GEMS******//
var Gem = function (color) {
    this.x = -101;
    this.y = -171;
    switch (color) {
        case "blue":
            this.sprite = "images/Gem Blue.png";
            this.val = 15;
            break;
        case "green":
            this.sprite = "images/Gem Green.png";
            this.val = 20;
            break;
        case "orange":
            this.sprite = "images/Gem Orange.png";
            this.val = 25;
            break;
    }
};

//UPDATE GEMS POSITION
Gem.prototype.update = function (x, y) {
    this.x = x;
    this.y = y;
};

//DESTROY GEM
Gem.prototype.destroy = function () {
    this.x = undefined;
    this.y = undefined;
};

//RENDER GEM
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//******ENEMY******//
var Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed * 20;
    this.sprite = "images/enemy-bug.png";
};

//UPDATE ENEMYS POSITION
Enemy.prototype.update = function (dt) {
    if (this.x > 505 + 101)
        this.x = -101;
    this.x = (this.x + this.speed * dt);
};

//UPDATE ENEMYS SPEED
Enemy.prototype.updateSpeed = function (num) {
    this.speed *= Math.ceil(num/2);
};

//RENDER ENEMY
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//******PLAYER******//
var Player = function () {
    this.x = (505 - 101) / 2;
    this.y = 606 - 171;
    this.sprite = "images/char-horn-girl.png";
};

//HANDLE KEYBOARD EVENTS RELATED TO PLAYER
Player.prototype.handleInput = function (key) {
    switch (key) {
        case "left":
            if(this.x > 0)
                this.x -= 101;
            break;
        case "up":
            if (this.y > 72)
                this.y -= 72;
            break;
        case "right":
            if(this.x < 505 - 101)
                this.x += 101;
            break;
        case "down":
            if(this.y < 606 - 171)
                this.y += 72;
            break;
    }
};

//RESET PLAYERS POSITION
Player.prototype.reset = function () {
    this.x = (505 - 101) / 2;
    this.y = 606 - 171;
};

//RENDER PLAYER
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//******LEVEL STAR******//
var Star = function () {
    this.sprite = "images/Star.png";
};

Star.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//*****MAIN******//
var player = new Player();
var star = new Star();

var en1 = new Enemy(-101, 55, 3);
var en2 = new Enemy(-303, 145, 2);
var en3 = new Enemy(-150, 230, 2.5);
var allEnemies = [en1, en2, en3];

var gem1 = new Gem("orange");
var gem2 = new Gem("blue");
var gem3 = new Gem("green");
var gems = [gem1, gem2, gem3];
