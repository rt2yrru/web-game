"use strict";

/* Important Variables */
var canvas = document.getElementById("main-canvas"),
    context = canvas.getContext("2d");

/* Classes */
///
//The Vector2 class contains an X and Y coordinate. This is mainly used for setting the position of game objects.
///
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //Finds the distance between two Vectors
    static Distance(a, b) {
        return Math.sqrt( Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) );
    }
}

///
//The Rect class contains a width and height. This is mainly used for setting the width and height of sprites in the game world.
///
class Rect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

class GameObject {
    constructor(name, pos, size, spritePath) {
        //Give default values to all parameters
        name = name || "New GameObject";
        pos = pos || new Vector2(0, 0);
        size = size || new Rect(0, 0);
        spritePath = spritePath || "";

        this.name = name;
        this.pos = pos;
        this.size = size;
        this.sprite = new Image(size.width, size.height);
        this.sprite.src = spritePath;

        //Draw the game object
        this.draw = function() {
            if(this.sprite === undefined)
                return;

            context.drawImage(this.sprite, this.pos.x, this.pos.y, this.size.width, this.size.height);
        }

        this.update = function() {  }
    }
}

/* GameObjects in the game */
class Player extends GameObject {
    constructor(name, pos, size, spritePath,  speed) {
        super(name, pos, size, spritePath);

        speed = speed || 5;

        this.speed = speed;

        //Moves the player
        this.move = function(x, y) {
            x = x || 0;
            y = y || 0;

            this.pos.x += x;
            this.pos.y += y;
        }
    }
}


/* Variables */
var player = new Player("Player1", new Vector2(canvas.width / 2, canvas.height / 2), new Rect(50, 50), "sprites/TestSprite.png", 5);

var localFunctions = {
    handlePlayerInput: function(e) {
        var keyCode = e.keyCode;
        var xOffset = 0;
        var yOffset = 0;

        //A
        if(keyCode === 97) {
            xOffset -= player.speed;
        }

        //W
        if(keyCode === 119) {
            yOffset -= player.speed;
        }

        //D
        if(keyCode === 100) {
            xOffset += player.speed;
        }

        //S
        if(keyCode === 115) {
            yOffset += player.speed;
        }

        player.move(xOffset, yOffset);
    }
}

/* Game Functions */
function start() {
    draw(); //This acts as an inital draw
    window.addEventListener("keypress", localFunctions.handlePlayerInput, false);
}

function update() {
    //Handle user input
    player.update();

    if(player.pos.x >= 650 && player.pos.x <= 700 && player.pos.y >= 50 && player.pos.y <= 100) {
        alert("Collision!");
    }
}

function draw() {
    //Draw the background
    context.fillStyle = "green";
    context.fillRect(0, 0, 3000, 1000);

    //Other objects
    context.fillStyle = "red";
    context.fillRect(150, 250, 50, 50);

    context.fillStyle = "red";
    context.fillRect(650, 50, 50, 50);

    //Draw the player
    player.draw();

    console.log("PLAYER INFO:\n" + "X: " + player.pos.x + " - Y: " + player.pos.y);
}

function finish() {

}

function mainLoop() {
    update();
    draw();
    requestAnimationFrame(mainLoop);
}

start();
requestAnimationFrame(mainLoop);
finish();
