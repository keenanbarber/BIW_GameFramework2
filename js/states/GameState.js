// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var player;
var transitionRect;
var t;

MyGame.GameState = function() {
	"use strict"; 
	Phaser.State.call(this);
};

MyGame.GameState.prototype = Object.create(Phaser.State.prototype);
MyGame.GameState.prototype.constructor = MyGame.GameState;

MyGame.GameState.prototype.init = function(game_details_data) {
	"use strict";
	this.game_details_data = game_details_data;
	this.MINIMUM_SWIPE_LENGTH = 40;
	
	window.addEventListener('resize', this.onResize);
};

MyGame.GameState.prototype.onResize = function() { // TESTING
	"use strict";
	//console.log("Resized");
	deviceOrientation = (device === "MOBILE" ? 
							(window.innerWidth > window.innerHeight ? "LANDSCAPE" : "PORTRAIT") : 
							"LANDSCAPE");
	console.log(deviceOrientation);
};

MyGame.GameState.prototype.create = function() {
	"use strict"; 

	//t = Transition('silver');
	//t.tweenTranslate(Phaser.Easing.Bounce.Out, 1400, "BOTTOM_TO_TOP");

	// Add events to check for swipe
	this.game.input.onDown.add(this.start_swipe, this);
	this.game.input.onUp.add(this.end_swipe, this);

	player = Text("Testing ", { font: "15px Arial", fill: 'white', align: "center" });
	player.setPartialColor(1, 2, "orange");

};

MyGame.GameState.prototype.update = function() {
	"use strict"; 
	//console.log("Update");
};

MyGame.GameState.prototype.render = function() {
	"use strict"; 
	//t.render();
};

MyGame.GameState.prototype.start_swipe = function (pointer) {
    "use strict";
    //console.log("Press down.");

    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
};

MyGame.GameState.prototype.end_swipe = function (pointer) {
    "use strict";	
    //console.log("Press up.");
    if(this.start_swipe_point != null && this.end_swipe_point == null) {

	    var swipe_length
	    this.end_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	    swipe_length = Phaser.Point.distance(this.end_swipe_point, this.start_swipe_point);

	    //console.log(swipe_length);
	    // if the swipe length is greater than the minimum, a swipe is detected
	    if (swipe_length >= this.MINIMUM_SWIPE_LENGTH) {
	        let calculatedSwipeDirectionVector = new Phaser.Point(this.end_swipe_point.x - this.start_swipe_point.x, this.end_swipe_point.y - this.start_swipe_point.y).normalize();
		    
		    this.findDirectionOfSwipe(calculatedSwipeDirectionVector);
	    }
	}

    this.end_swipe_point = null;
    this.start_swipe_point = null;
};

MyGame.GameState.prototype.findDirectionOfSwipe = function(d) {
	/* Could be made more efficient, but it works for now. */

	let bestVector = null;
	let bestDist = 0;
	let currentVector = null;
	let dist = 0;

	currentVector = new Phaser.Point(-1, 0);
	bestDist = d.distance(currentVector);
	bestVector = "LEFT";

	currentVector = new Phaser.Point(1, 0);
	dist = d.distance(currentVector);
	if(dist < bestDist) {
		bestDist = dist;
		bestVector = "RIGHT";
	}

	currentVector = new Phaser.Point(0, -1);
	dist = d.distance(currentVector);
	if(dist < bestDist) {
		bestDist = dist;
		bestVector = "UP";
	}

	currentVector = new Phaser.Point(0, 1);
	dist = d.distance(currentVector);
	if(dist < bestDist) {
		bestDist = dist;
		bestVector = "DOWN";
	}

	console.log("Swipe: " + bestVector);
	return bestVector;
};



