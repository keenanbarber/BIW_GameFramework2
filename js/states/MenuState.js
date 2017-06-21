// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var player;
var transitionRect;
var t;

MyGame.MenuState = function() {
	"use strict"; 
};

MyGame.MenuState.prototype = {
	init: function(game_details_data) {
		"use strict";
		this.game_details_data = game_details_data;
		this.MINIMUM_SWIPE_LENGTH = 40;
		this.sceneProps

		window.addEventListener('resize', this.onResize);
	},
	
	preload: function() {

	},

	create: function() {
		"use strict"; 

		this.sceneProps = game.add.group();

		let thing1 = game.add.sprite(250, 150, 'test_image');
		let thing2 = game.add.sprite(350, 150, 'test_image');
		let thing3 = game.add.sprite(450, 150, 'test_image');

		this.sceneProps.add(thing1);
		this.sceneProps.add(thing2);
		this.sceneProps.add(thing3);

		//game.add.tween(sceneProps).to({x: 300, y: 0}, 2000, Phaser.Easing.Bounce.Out, true);

		//t = Transition('silver');
		//t.tweenTranslate(Phaser.Easing.Bounce.Out, 1400, "BOTTOM_TO_TOP");

		// Add events to check for swipe
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);

		//player = Text("Testing ", { font: "15px Arial", fill: 'white', align: "center" });
		//player.setPartialColor(1, 2, "orange");


		EnterNewScene(this.sceneProps, TranslateTween("TOP_TO_CENTER", 1000, Phaser.Easing.Bounce.Out));
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	}, 

	onResize: function() {
		"use strict";
		//console.log("Resized");
		deviceOrientation = (device === "MOBILE" ? 
								(window.innerWidth > window.innerHeight ? "LANDSCAPE" : "PORTRAIT") : 
								"LANDSCAPE");
		console.log(deviceOrientation);
	},

	start_swipe: function(pointer) {
		"use strict";
	    //console.log("Press down.");
	    //this.exitTransition();
	    this.game.state.start("GameState", false, false, this.game_details_data, this);
	    //this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	},

	end_swipe: function(pointer) {
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
	},

	findDirectionOfSwipe: function(d) {
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
	}
};

