"use strict";

/* Classes */
//The Vector2 class is one of the most important classes. It contains an X and a Y coordinate.
class Vector2 {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
}

//The Rect class contains a width and height. This is mainly used for setting the width and height of sprites in the game world.
class Rect {
    constructor(position, width, height) {
        this.position = position || new Vector2();
        this.width = width || 0;
        this.height = height || 0;
    }
	
	//Returns true if this rect is overlapping with another rect, false otherwise.
	isOverlapping(rect) {
		return utils.rangeIntersect(this.position.x, this.position.x + this.width, rect.position.x, rect.position.x + rect.width) &&
			utils.rangeIntersect(this.position.y, this.position.y + this.height, rect.position.y, rect.position.y + rect.height);
	}
	
	//Draws an outline around the rect. Practical for debugging.
	drawOutline(color) {
		color = color || "black";

		context.strokeStyle = color;
		context.rect(this.position.x, this.position.y, this.width, this.height);
		context.stroke();
	}
}

//The GameObject class contains information about every game object in the world.
class GameObject {
    constructor(name, rect, spritePath) {
        //Give default values to all parameters
        name = name || "New GameObject";
        rect = rect || new Rect();
        spritePath = spritePath || "";

        //Set up the object
        this.name = name;
        this.rect = rect;
        this.sprite = new Image(rect.width, rect.height);
        this.sprite.src = spritePath;
		this.previousPosition = new Vector2();
		
		//Listen for events
		window.addEventListener("onCollide", this.collisionHandler);
    }
	
	//Draw the game object
	draw() {
		if(this.sprite === undefined || this.sprite === null) {
			return;
		}
            
		context.drawImage(this.sprite, this.rect.position.x, this.rect.position.y, this.rect.width, this.rect.height);
	}
	
	//Moves the game object
	move(position) {
		position = position || new Vector2(0, 0);
		
		this.rect.position.x += position.x;
		this.rect.position.y += position.y;
	}
	
	//Triggers a collison with another game object
	triggerCollision(gameObj, gameObjCol) {
		//console.log("Trigger collision event.");
			
		var collisionEvent = new CustomEvent("onCollide", {
			"detail": {
				gameObject: gameObj,
				gameObjectCollidedWith: gameObjCol
			}
		});
		
		window.dispatchEvent(collisionEvent);
	}
	
	//Logic that happens during a collision.
	collisionHandler(e) { }
	
	//Called every frame.
	update() {
		this.previousPosition = new Vector2(this.rect.position.x, this.rect.position.y);
		this.rect.drawOutline("black");
	}

    //Creates a new instance of a provided game object
    static createNewInstance(instance) {
        if (instance === undefined || instance === null) {
            return undefined;
        }

        //Make new instance of and return the game object
        return new GameObject(instance.name, new Rect(new Vector2(), instance.rect.width, instance.rect.height), instance.sprite.src);
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
		var gameObj = e.detail.gameObject;
		var collidedGameObj = e.detail.gameObjectCollidedWith;
		
		if(gameObj.rect.position.x < collidedGameObj.rect.position.x) { //Left side
			gameObj.rect.position.x = collidedGameObj.rect.position.x - gameObj.rect.width;
		} else if(gameObj.rect.position.x > collidedGameObj.rect.position.x) { //Right side
			gameObj.rect.position.x = collidedGameObj.rect.position.x + collidedGameObj.rect.width;
		}
	}
	
	update() {
		
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

/* Main game variable stuff */
Game.Keycode = {
	A: 97,
	B: 98,
	C: 99,
	D: 100,
	E: 101,
	F: 102,
	G: 103,
	H: 104,
	I: 105,
	J: 106,
	K: 107,
	L: 108,
	M: 109,
	N: 110,
	O: 111,
	P: 112,
	Q: 113,
	R: 114,
	S: 115,
	T: 116,
	U: 117,
	V: 118,
	W: 119,
	X: 120,
	Y: 121,
	Z: 122
};

Game.GameObjects = {
    Player: new Player(name = "Player1", new Rect(new Vector2((canvasWidth / 2) - (80 / 2), (canvasHeight / 2) - (80 / 2)), 80, 80), "sprites/player.png", 5),
    Bush: new GameObject("Bush", new Rect(new Vector2(), 64, 64), "sprites/bush.png")
};

var localFunctions = {
    handlePlayerInput: function(e) {
        var keyCode = e.which;
        var xOffset = 0;
        var yOffset = 0;
		
        //A
        if(keyCode === Game.Keycode.A) {
            xOffset -= Game.GameObjects.Player.speed;
        }

        //W
        if(keyCode === Game.Keycode.W) {
            yOffset -= Game.GameObjects.Player.speed;
        }

        //D
        if(keyCode === Game.Keycode.D) {
            xOffset += Game.GameObjects.Player.speed;
        }

        //S
        if(keyCode === Game.Keycode.S) {
            yOffset += Game.GameObjects.Player.speed;
        }

        Game.GameObjects.Player.move(new Vector2(xOffset, yOffset));
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
            gameObj.rect.position.x = gameObj.rect.position.x + (gameObj.rect.width * i);
            gameObj.rect.position.y = 0;

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
            gameObj.rect.position.x = gameObj.rect.position.x + (gameObj.rect.width * i);
            gameObj.rect.position.y = canvas.height - gameObj.rect.height;

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
            gameObj.rect.position.x = 0;
            gameObj.rect.position.y = gameObj.rect.position.y + (gameObj.rect.height * i);

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
            gameObj.rect.position.x = canvasWidth - gameObj.rect.width;
            gameObj.rect.position.y = gameObj.rect.position.y + (gameObj.rect.height * i);

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
					Game.GameObjects.Player.triggerCollision(Game.GameObjects.Player, _totalGameObjects[i]);
					
					break;
				}
			}
		}
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
}

function update() {
	var i;
	for(i = 0; i < _totalGameObjects.length; i++) {
		_totalGameObjects[i].update();
	}
}

function detectCollision() {
	//Player collision
	collisionFunctions.detectPlayerCollision();
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
	Game.GameObjects.Player.rect.drawOutline("red");
}

function finish() {
	
}

function mainLoop() {
    update();
	detectCollision();
    draw();
    requestAnimationFrame(mainLoop);
}

start();
requestAnimationFrame(mainLoop);
finish();
