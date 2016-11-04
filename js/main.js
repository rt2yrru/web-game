"use strict";

/* Important Variables */
var canvas = document.getElementById("main-canvas"),
    context = canvas.getContext("2d");

var utils = {
    rangeIntersect: function(min0, max0, min1, max1) {
        return Math.max(min0, max0) > Math.min(min1, max1) &&
            Math.min(min0, max0) < Math.max(min1, max1);
    }
}

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
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //Draws a debugging outline around the shape
        this.drawOutline = function(color) {
            color = color || "black";

            context.strokeStyle = color;
            context.rect(this.x, this.y, this.width, this.height);
            context.stroke();
        }

        //Returns true if this rect is overlapping with another rect, false otherwise.
        this.isOverlapping = function(rect) {
            return utils.rangeIntersect(this.x, this.x + this.width, rect.x, rect.x + rect.width) &&
                utils.rangeIntersect(this.y, this.y + this.height, rect.y, rect.y + rect.height);
        }
    }
}

///
//The GameObject class contains information about every game object in the world.
///
class GameObject {
    constructor(name, rect, spritePath) {
        //Give default values to all parameters
        name = name || "New GameObject";
        //pos = pos || new Vector2(0, 0);
        rect = rect || new Rect(0, 0, 0, 0);
        spritePath = spritePath || "";

        this.name = name;
        //this.pos = pos;
        this.rect = rect;
        this.sprite = new Image(rect.width, rect.height);
        this.sprite.src = spritePath;

        //Draw the game object
        this.draw = function(withoutSprite, color) {
            withoutSprite = withoutSprite || false;
            color = color || "black"

            if(this.sprite === undefined && withoutSprite)
                return;

            if(!withoutSprite) {
                context.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            } else {
                context.fillStyle = color;
                context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            }
        }

        //Moves the game object
        this.move = function(x, y) {
            x = x || 0;
            y = y || 0;

            this.rect.x += x;
            this.rect.y += y;
        }
    }
}

/* GameObjects in the game */
class Player extends GameObject {
    constructor(name, rect, spritePath,  speed) {
        super(name, rect, spritePath);

        speed = speed || 5;

        this.speed = speed;
    }
}

/* Variables */
var player = new Player("Player1", new Rect(canvas.width / 2, canvas.height /2, 64, 64), "sprites/player.png", 5);
var bushes = [
    new GameObject("Bush1", new Rect(0, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush2", new Rect(64, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush3", new Rect(128, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush4", new Rect(192, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush5", new Rect(256, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush6", new Rect(320, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush7", new Rect(384, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush8", new Rect(448, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush9", new Rect(512, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush10", new Rect(576, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush11", new Rect(640, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush12", new Rect(704, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush13", new Rect(768, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush14", new Rect(832, 0, 64, 64), "sprites/bush.png"),
    new GameObject("Bush15", new Rect(896, 0, 64, 64), "sprites/bush.png")
];

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
    for(var i = 0; i < bushes.length; i++) {
        if(player.rect.isOverlapping(bushes[i].rect)) {
            console.log("Player is overlapping with: \"" + bushes[i].name + "\"!");
        }
    }
}

function draw() {
    //context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.width;

    //Draw the background
    context.fillStyle = "green";
    context.fillRect(0, 0, 3000, 1000);

    //Draw the map outlines
    for(var i = 0; i < bushes.length; i++) { //Top
        bushes[i].draw();
        console.log(bushes[i].name);
    }

    //Draw the player
    player.draw();

    //Debugging
    //Draw border around player's collision bounds
    player.rect.drawOutline("red");
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
