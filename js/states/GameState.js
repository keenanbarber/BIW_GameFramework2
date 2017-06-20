// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var playerDirection = "RIGHT";
var player;
var colliding = false;
var BOTTOM_BOUND = 300;
var TOP_BOUND = 50;
var LEFT_BOUND = 50;
var RIGHT_BOUND = 400;

MyGame.GameState = function() {
	"use strict"; 
	Phaser.State.call(this);
};

MyGame.GameState.prototype = Object.create(Phaser.State.prototype);
MyGame.GameState.prototype.constructor = MyGame.GameState;

MyGame.GameState.prototype.init = function(game_details_data) {
	"use strict";
	this.game_details_data = game_details_data;
	this.MINIMUM_SWIPE_LENGTH = 50;
	
	window.addEventListener('resize', this.onResize);
	window.addEventListener("deviceorientation", this.handleAccelerometer, true);  // Accelerometer
};

MyGame.GameState.prototype.onResize = function() { // TESTING
	console.log("Resized");

	if(device === "MOBILE") {
		if(window.innerWidth > window.innerHeight) {
			deviceOrientation = "LANDSCAPE";
		}
		else {
			deviceOrientation = "PORTRAIT";
		}
	}
	else {
		deviceOrientation = "LANDSCAPE";
	}


	console.log(deviceOrientation);
	game.scale.refresh();

};

MyGame.GameState.prototype.create = function() {
	"use strict"; 

	// Add events to check for swipe
	this.game.input.onDown.add(this.start_swipe, this);
	this.game.input.onUp.add(this.end_swipe, this);

	player = this.makeText("0 ", { font: "40px Arial", fill: "#ffffff", align: "center" });
};

MyGame.GameState.prototype.update = function() {
	"use strict"; 

	console.log("Update");
	
	this.updatePlayer();
};

MyGame.GameState.prototype.updatePlayer = function() {
	let amount = 2;
	if(!colliding) {
		amount = amount*3;
	}
	if(playerDirection === "RIGHT") {
		player.x += amount;
		if(player.x >= RIGHT_BOUND && player.y >= BOTTOM_BOUND) {
			playerDirection = "UP";
			player.x = RIGHT_BOUND;
			player.y = BOTTOM_BOUND;
		}
		else if(player.x >= RIGHT_BOUND && player.y <= TOP_BOUND) {
			playerDirection = "DOWN";
			player.x = RIGHT_BOUND;
			player.y = TOP_BOUND;
		}
		else if(player.x <= LEFT_BOUND) {
			playerDirection = "DOWN"; 
			player.x = LEFT_BOUND;
		}
		else if(player.x >= RIGHT_BOUND) {
			playerDirection = "UP"; 
			player.x = RIGHT_BOUND;
		}
	}
	else if(playerDirection === "LEFT") {
		player.x -= amount;
		if(player.x <= LEFT_BOUND && player.y >= BOTTOM_BOUND) {
			playerDirection = "UP";
			player.x = LEFT_BOUND;
			player.y = BOTTOM_BOUND;
		}
		else if(player.x <= LEFT_BOUND && player.y <= TOP_BOUND) {
			playerDirection = "DOWN";
			player.x = LEFT_BOUND;
			player.y = TOP_BOUND;
		}
		else if(player.x <= LEFT_BOUND) {
			playerDirection = "DOWN"; 
			player.x = LEFT_BOUND;
		}
		else if(player.x >= RIGHT_BOUND) {
			playerDirection = "UP"; 
			player.x = RIGHT_BOUND;
		}
	}
	else if(playerDirection === "UP") {
		player.y -= amount;
		if(player.y <= TOP_BOUND && player.x >= RIGHT_BOUND) {
			playerDirection = "LEFT";
			player.x = RIGHT_BOUND;
			player.y = TOP_BOUND;
		}
		else if(player.y <= TOP_BOUND && player.x <= LEFT_BOUND) {
			playerDirection = "RIGHT";
			player.x = LEFT_BOUND;
			player.y = TOP_BOUND;
		}
		else if(player.y <= TOP_BOUND) {
			playerDirection = "RIGHT"; 
			player.y = TOP_BOUND;
		}
		else if(player.y >= BOTTOM_BOUND) {
			playerDirection = "LEFT"; 
			player.y = BOTTOM_BOUND;
		}
	}
	else if(playerDirection === "DOWN") {
		player.y += amount;
		if(player.y >= BOTTOM_BOUND && player.x >= RIGHT_BOUND) {
			playerDirection = "LEFT";
			player.x = RIGHT_BOUND;
			player.y = BOTTOM_BOUND;
		}
		else if(player.y >= BOTTOM_BOUND && player.x <= LEFT_BOUND) {
			playerDirection = "RIGHT";
			player.x = LEFT_BOUND;
			player.y = BOTTOM_BOUND;
		}
		else if(player.y <= TOP_BOUND) {
			playerDirection = "RIGHT"; 
			player.y = TOP_BOUND;
		}
		else if(player.y >= BOTTOM_BOUND) {
			playerDirection = "LEFT";
			player.y = BOTTOM_BOUND; 
		}
	}
	colliding = this.playerCheckCollisions();
};

MyGame.GameState.prototype.start_swipe = function (pointer) {
    "use strict";
    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);

	console.log("Press down.");
};

MyGame.GameState.prototype.end_swipe = function (pointer) {
    "use strict";	
    if(this.start_swipe_point != null && this.end_swipe_point == null) {

	    var swipe_length
	    this.end_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	    swipe_length = Phaser.Point.distance(this.end_swipe_point, this.start_swipe_point);

	    console.log(swipe_length);
	    // if the swipe length is greater than the minimum, a swipe is detected
	    if (swipe_length >= this.MINIMUM_SWIPE_LENGTH) {
	        let calculatedSwipeDirectionVector = new Phaser.Point(this.end_swipe_point.x - this.start_swipe_point.x, this.end_swipe_point.y - this.start_swipe_point.y).normalize();
		    
		    this.setPlayerDirection(this.findDirectionOfSwipe(calculatedSwipeDirectionVector));
	    }
	    console.log("Press up.");

	}

    this.end_swipe_point = null;
    this.start_swipe_point = null;
};

MyGame.GameState.prototype.playerCheckCollisions = function() {
	if(player.y <= TOP_BOUND || player.y >= BOTTOM_BOUND || player.x <= LEFT_BOUND || player.x >= RIGHT_BOUND) {
		return true;
	}
};

MyGame.GameState.prototype.setPlayerDirection = function(d) {
	if(colliding) {
		if(d.x == 1 && player.x < RIGHT_BOUND) {
			playerDirection = "RIGHT";
		}
		else if(d.x == -1 && player.x > LEFT_BOUND) {
			playerDirection = "LEFT";
		}
		else if(d.y == 1 && player.y < BOTTOM_BOUND) {
			playerDirection = "DOWN";
		}
		else if(d.y == -1 && player.y > TOP_BOUND) {
			playerDirection = "UP";
		}
	}
};

MyGame.GameState.prototype.findDirectionOfSwipe = function(d) {
	/* Could be made more efficient, but it works for now. */

	let bestVector = null;
	let bestDist = 0;
	let currentVector = null;
	let dist = 0;

	currentVector = new Phaser.Point(-1, 0); // Up
	bestDist = d.distance(currentVector);
	bestVector = currentVector;

	currentVector = new Phaser.Point(1, 0); // Down
	dist = d.distance(currentVector);
	if(dist < bestDist) {
		bestDist = dist;
		bestVector = currentVector;
	}

	currentVector = new Phaser.Point(0, -1); // Left
	dist = d.distance(currentVector);
	if(dist < bestDist) {
		bestDist = dist;
		bestVector = currentVector;
	}

	currentVector = new Phaser.Point(0, 1); // Right
	dist = d.distance(currentVector);
	if(dist < bestDist) {
		bestDist = dist;
		bestVector = currentVector;
	}

	console.log("Best Vector: " + bestVector);
	return bestVector;
};

MyGame.GameState.prototype.handleAccelerometer = function(e) {
    var z = e.alpha;
    var y = e.beta;
    var x = e.gamma;
    console.log("Orientation: x=" + x + ", y=" + y + ", z=" + z);
};

MyGame.GameState.prototype.makeText = function(t, style) {
	let text = game.add.text(game.world.centerX, game.world.centerY, t, style);
    text.anchor.set(0.5);
    this.colorText(text, 1, 4, "#ffff00", "#ffffff")
    return text;
};

MyGame.GameState.prototype.colorText = function(t, x1, x2, newColor, originalColor) {
	t.addColor(newColor, x1);
    t.addColor(originalColor, x2);
};
















