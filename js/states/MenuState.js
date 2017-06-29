// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var text_test;
var text_test_style;
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

		UpdateScreenInfo();
	},
	
	preload: function() {

	},

	create: function() {
		"use strict"; 

		this.sceneProps = game.add.group();

		text_test_style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		text_test = game.add.text(game.world.centerX, game.world.centerY/2, "Some Title", text_test_style);
		text_test.anchor.setTo(0.5);
		this.sceneProps.add(text_test);


		this.addButtons();


		// Add events to check for swipe
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);


		this.positionComponents(game.width, game.height);
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	}, 

	positionComponents: function(width, height) {
		let isLandscape = (game.height / game.width < 1.3) ? true : false;
		if(isLandscape) {
			ScaleText(text_test, width/2, height, 10, 1);
			text_test.x = game.world.centerX;
			text_test.y = height/4;

			ScaleSprite(this.button1.getSprite(), width/3, height/5, 10, 1);
			this.button1.getSprite().x = width / 4;
			this.button1.getSprite().y = height * 2/5 + this.button1.getSprite().height/2;

			ScaleSprite(this.button2.getSprite(), width/3, height/5, 10, 1);
			this.button2.getSprite().x = width / 4;
			this.button2.getSprite().y = height * 3/5 + this.button2.getSprite().height/2;

			ScaleSprite(this.button3.getSprite(), width/3, height/5, 10, 1);
			this.button3.getSprite().x = width / 4;
			this.button3.getSprite().y = height * 4/5 + this.button3.getSprite().height/2;
		}
		else {
			ScaleText(text_test, width, height, 20, 1);
			text_test.x = game.world.centerX;
			text_test.y = game.world.centerY/2;

			ScaleSprite(this.button1.getSprite(), width/3, height/5, 10, 1);
			this.button1.getSprite().x = width / 2;
			this.button1.getSprite().y = height * 2/5 + this.button1.getSprite().height/2;

			ScaleSprite(this.button2.getSprite(), width/3, height/5, 10, 1);
			this.button2.getSprite().x = width / 2;
			this.button2.getSprite().y = height * 3/5 + this.button2.getSprite().height/2;

			ScaleSprite(this.button3.getSprite(), width/3, height/5, 10, 1);
			this.button3.getSprite().x = width / 2;
			this.button3.getSprite().y = height * 4/5 + this.button3.getSprite().height/2;
		}
	},

	resize: function(width, height) {
		"use strict";
		UpdateScreenInfo();
		//console.log("Resized");

		this.positionComponents(width, height);
		game.scale.refresh();
	},

	start_swipe: function(pointer) {
		"use strict";
	    //console.log("Press down.");
	    //this.exitTransition();
	    
	    //this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	    // this.game.state.start("GameState", false, false, this.game_details_data, this);
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
	}, 

	addButtons: function() {
		
		let obj = this; // Reference to the scene

		this.button1 = SpriteButton(100, 100, 'green_square');
		this.button1.setBehaviors(
			function() { //On mouse over...
				// console.log("Over");
			}, 
			function() { //On mouse off...
				// console.log("Off");
			},
			function() { //On mouse down...
				// console.log("Down");
				this.storedScale = new Phaser.Point(this.getSprite().scale.x, this.getSprite().scale.y);
				this.getSprite().loadTexture('red_square');
				Tweenimate_ElasticScale(this.getSprite(), this.storedScale.x - (this.storedScale.x * 0.2), this.storedScale.y - (this.storedScale.y * 0.2), 1000);
			}, 
			function() { //On mouse up...
				// console.log("Up");
				this.getSprite().loadTexture('green_square');
				Tweenimate_ElasticScale(this.getSprite(), this.storedScale.x, this.storedScale.y, 1000);
			}
		);
		this.button1.setClickBehavior(function() {
			console.log("CLICK");
			obj.game.state.start("GameState", false, false, this.game_details_data, obj);
		});
		this.sceneProps.add(this.button1.getSprite());


		this.button2 = SpriteButton(100, 100, 'green_square');
		this.button2.setBehaviors(
			function() { //On mouse over...
				// console.log("Over");
			}, 
			function() { //On mouse off...
				// console.log("Off");
			},
			function() { //On mouse down...
				// console.log("Down");
				this.storedScale = new Phaser.Point(this.getSprite().scale.x, this.getSprite().scale.y);
				this.getSprite().loadTexture('red_square');
				Tweenimate_ElasticScale(this.getSprite(), this.storedScale.x - (this.storedScale.x * 0.2), this.storedScale.y - (this.storedScale.y * 0.2), 1000);
			}, 
			function() { //On mouse up...
				// console.log("Up");
				this.getSprite().loadTexture('green_square');
				Tweenimate_ElasticScale(this.getSprite(), this.storedScale.x, this.storedScale.y, 1000);
			}
		);
		this.button2.setClickBehavior(function() {
			console.log("CLICK");
		});
		this.sceneProps.add(this.button2.getSprite());


		this.button3 = SpriteButton(100, 100, 'green_square');
		this.button3.setBehaviors(
			function() { //On mouse over...
				// console.log("Over");
			}, 
			function() { //On mouse off...
				// console.log("Off");
			},
			function() { //On mouse down...
				// console.log("Down");
				this.storedScale = new Phaser.Point(this.getSprite().scale.x, this.getSprite().scale.y);
				this.getSprite().loadTexture('red_square');
				Tweenimate_ElasticScale(this.getSprite(), this.storedScale.x - (this.storedScale.x * 0.2), this.storedScale.y - (this.storedScale.y * 0.2), 1000);
			}, 
			function() { //On mouse up...
				// console.log("Up");
				this.getSprite().loadTexture('green_square');
				Tweenimate_ElasticScale(this.getSprite(), this.storedScale.x, this.storedScale.y, 1000);
			}
		);
		this.button3.setClickBehavior(function() {
			console.log("CLICK");
		});
		this.sceneProps.add(this.button3.getSprite());
	}


















};

