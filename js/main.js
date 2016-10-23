//Element related variables
var canvas = document.getElementById("main-canvas"),
  context = canvas.getContext("2d");

//Objects with constructors
function Vector2(x, y) {
  this.x = x;
  this.y = y;
}
Vector2.Distance = function (a, b) {
  return Math.sqrt( Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) );
};

//Objects without constructors
var Player = {
  pos : new Vector2(canvas.width / 2, canvas.height / 2),
  size : new Vector2(50, 50),
  name : "Player1",
  speed : 5,
  draw : function() {
    context.fillStyle = "black";
    context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  },
  move : function(e) {
    var keyCode = e.keyCode;

    //A or left arrow
    if(keyCode === 65 || keyCode === 37) {
      Player.pos.x -= Player.speed;
    }

    //W or up arrow
    if(keyCode === 87 || keyCode === 38) {
      Player.pos.y -= Player.speed;
    }

    //D or right arrow
    if(keyCode === 68 || keyCode === 39) {
      Player.pos.x += Player.speed;
    }

    //S or down arrow
    if(keyCode === 83 || keyCode === 40) {
      Player.pos.y += Player.speed;
    }
  }
}

//Game functions
function start() {
  draw(); //This acts as an inital draw
}

function update() {
  //Handle user input
  document.onkeydown = Player.move;

  if(Player.pos.x >= 650 && Player.pos.x <= 700 && Player.pos.y >= 50 && Player.pos.y <= 100) {
    alert("Collision!");
  }
}

function draw() {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);

  //context.translate(0, 0);

  context.fillStyle = "green";
  context.fillRect(0, 0, 3000, 1000);

  Player.draw(canvas.width / 2, canvas.height / 2);

  //Other objects
  context.fillStyle = "red";
  context.fillRect(150, 250, 50, 50);

  context.fillStyle = "red";
  context.fillRect(650, 50, 50, 50);

  console.log("X: " + Player.pos.x + " - Y: " + Player.pos.y);
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
