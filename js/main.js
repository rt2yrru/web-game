"use strict";

/* Classes */
//The Rect class contains a width and height. This is mainly used for setting the width and height of sprites in the game world.
class Rect {
    constructor(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
		
		//Events (must be placed after all of the functions above
		window.addEventListener("onCollide", this.collisionHandler);
    }
	
	//Returns true if this rect is overlapping with another rect, false otherwise.
	isOverlapping(rect) {
		return utils.rangeIntersect(this.x, this.x + this.width, rect.x, rect.x + rect.width) &&
			utils.rangeIntersect(this.y, this.y + this.height, rect.y, rect.y + rect.height);
	}
	
	//Draws an outline around the rect. Practical for debugging.
	drawOutline(color) {
		color = color || "black";

            context.strokeStyle = color;
            context.rect(this.x, this.y, this.width, this.height);
            context.stroke();
	}
	
	triggerCollision() {
		console.log("Trigger collision event.");
			
		var collisionEvent = new CustomEvent("onCollide", {
			"detail": {
				collider: this
			}
		});
		
		window.dispatchEvent(collisionEvent);
	}
	
	collisionHandler(e) {
		console.log("Collision is being handled...");
	}
}

//The GameObject class contains information about every game object in the world.
class GameObject {
    constructor(name, rect, spritePath) {
        //Give default values to all parameters
        name = name || "New GameObject";
        rect = rect || new Rect(0, 0, 0, 0);
        spritePath = spritePath || "";

        //Set up the object
        this.name = name;
        this.rect = rect;
        this.sprite = new Image(rect.width, rect.height);
        this.sprite.src = spritePath;
    }
	
	//Draw the game object
	draw() {
		if(this.sprite === undefined) {
			return;
		}
            
		context.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
	}
	
	//Moves the game object
	move(x, y) {
		x = x || 0;
		y = y || 0;
		
		this.rect.x += x;
		this.rect.y += y;
	}

    //Creates a new instance of a provided game object
    static createNewInstance(instance) {
        if (instance === undefined) {
            return undefined;
        }

        //Make new instance of and return the game object
        return new GameObject(instance.name, new Rect(0, 0, instance.rect.width, instance.rect.height), instance.sprite.src);
    }
}

//The Player class that handles everything involved with the player.
class Player extends GameObject {
    constructor(name, rect, spritePath,  speed) {
        super(name, rect, spritePath);

        this.speed = speed || 1;
    }
	
	//Handles collision for the player
	collisionHandler(e) {
		console.log("shit");
	}
}

/* Important Variables */
var Game = { };
var canvas = document.getElementById("main-canvas"),
    context = canvas.getContext("2d"),
	canvasWidth = canvas.width,
	canvasHeight = canvas.height;

var utils = {
    rangeIntersect: function(min0, max0, min1, max1) {
        return Math.max(min0, max0) > Math.min(min1, max1) &&
            Math.min(min0, max0) < Math.max(min1, max1);
    }
};

/* Constants */
var KEY_A = 97;
var KEY_W = 119;
var KEY_D = 100;
var KEY_S = 115;

/* Main game variable stuff */
Game.GameObjects = {
    Player: new Player(name = "Player1", new Rect((canvasWidth / 2) - (80 / 2), (canvasHeight / 2) - (80 / 2), 80, 80), "sprites/player.png", 5),
    Bush: new GameObject("Bush", new Rect(0, 0, 64, 64), "sprites/bush.png")
};

var localFunctions = {
    handlePlayerInput: function(e) {
        var keyCode = e.keyCode;
        var xOffset = 0;
        var yOffset = 0;
		
        //A
        if(keyCode === KEY_A) {
            xOffset -= Game.GameObjects.Player.speed;
        }

        //W
        if(keyCode === KEY_W) {
            yOffset -= Game.GameObjects.Player.speed;
        }

        //D
        if(keyCode === KEY_D) {
            xOffset += Game.GameObjects.Player.speed;
        }

        //S
        if(keyCode === KEY_S) {
            yOffset += Game.GameObjects.Player.speed;
        }

        Game.GameObjects.Player.move(xOffset, yOffset);
    },
	addPlayer: function() {
		_totalGameObjects.push(Game.GameObjects.Player);
	},
	addTopBorder: function() {
		var i;
        var gameObj;

        for (i = 0; i < (canvasWidth / Game.GameObjects.Bush.rect.width); i++) {
            //Set position of the bush
            gameObj = GameObject.createNewInstance(Game.GameObjects.Bush);
            gameObj.rect.x = gameObj.rect.x + (gameObj.rect.width * i);
            gameObj.rect.y = 0;

            //Push game object to the total game objects list
            _totalGameObjects.push(gameObj);
        }
	},
	addBottomBorder: function() {
		var i;
        var gameObj;

        for (i = 0; i < (canvasWidth / Game.GameObjects.Bush.rect.width) ; i++) {
            //Set position of the bush
            gameObj = GameObject.createNewInstance(Game.GameObjects.Bush);
            gameObj.rect.x = gameObj.rect.x + (gameObj.rect.width * i);
            gameObj.rect.y = canvas.height - gameObj.rect.height;

            //Push game object to the total game objects list
            _totalGameObjects.push(gameObj);
        }
	},
	addLeftBorder: function() {
		var i;
        var gameObj;

        for (i = 0; i < (canvasHeight / Game.GameObjects.Bush.rect.height) ; i++) {
            //Set position of the bush
            gameObj = GameObject.createNewInstance(Game.GameObjects.Bush);
            gameObj.rect.x = 0;
            gameObj.rect.y = gameObj.rect.y + (gameObj.rect.height * i);

            //Push game object to the total game objects list
            _totalGameObjects.push(gameObj);
        }
	},
	addRightBorder: function() {
		var i;
        var gameObj;

        for (i = 0; i < (canvasHeight / Game.GameObjects.Bush.rect.height) ; i++) {
            //Set position of the bush
            gameObj = GameObject.createNewInstance(Game.GameObjects.Bush);
            gameObj.rect.x = canvasWidth - gameObj.rect.width;
            gameObj.rect.y = gameObj.rect.y + (gameObj.rect.height * i);

            //Push game object to the total game objects list
            _totalGameObjects.push(gameObj);
        }
	},
    addEvents: function() {
        window.addEventListener("keypress", localFunctions.handlePlayerInput, false);
		//window.addEventListener("onCollision", Game.GameObjects.Player.onCollision, false);
    }
};
var collisionFunctions = {
	detectPlayerCollision: function() {
		var i;
		
		//Check if player is colliding with any bushes
		for(i = 0; i < _totalGameObjects.length; i++) {
			if(_totalGameObjects[i].name === Game.GameObjects.Bush.name) {
				if(Game.GameObjects.Player.rect.isOverlapping(_totalGameObjects[i].rect)) {
					Game.GameObjects.Player.triggerCollision();
					break;
				}
			}
		}
	},
	handlePlayerCollison: function() {
		
	}
};

//Important gloabl variables
var _totalGameObjects = [];

/* Game Functions */
function start() {
	//Set size and height of game
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    //Add game objects to the total game objects list. This is so they are drawn every time the draw() function is called.
	localFunctions.addPlayer();
    localFunctions.addTopBorder();
    localFunctions.addBottomBorder();
    localFunctions.addLeftBorder();
    localFunctions.addRightBorder();
	
	localFunctions.addEvents(); //Add event handlers

    draw(); //This acts as an inital draw
	
	Game.GameObjects.Player.rect.triggerCollision();
}

function update() {
	
}

function detectCollision() {
	//Player collision
	//collisionFunctions.detectPlayerCollision();
}

function handleCollision() {
	//Player collision
	//collisionFunctions.handlePlayerCollison();
}

function draw() {
	canvas.width = canvas.width;
	
    //Load XML level
	// ...
	
    //Draw the background
	context.fillStyle = "green";
	context.fillRect(0, 0, canvasWidth, canvasHeight);

    //Draw all game objects
	for (var i = 0; i < _totalGameObjects.length; i++) {
	    _totalGameObjects[i].draw();
	}

    //Debugging
    //Draw border around player's collision bounds
	Game.GameObjects.Player.rect.drawOutline("red");
}

function finish() {
	
}

function mainLoop() {
    update();
	detectCollision();
	handleCollision();
    draw();
    requestAnimationFrame(mainLoop);
}

start();
requestAnimationFrame(mainLoop);
finish();
