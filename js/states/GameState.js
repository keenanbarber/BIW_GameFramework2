// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var text_test;
var transitionRect;
var t;
var physics;

MyGame.GameState = function(game) {
	"use strict"; 
};


MyGame.GameState.prototype = {
	init: function(game_details_data, previousState) {
		"use strict";
		this.game_details_data = game_details_data;
		this.MINIMUM_SWIPE_LENGTH = 40;

		physics = Physics();

		ExitPreviousScene(previousState.sceneProps, TranslateTween("CENTER_TO_BOTTOM", 1000, Phaser.Easing.Bounce.Out));
	},

	preload: function() {

	},

	create: function() {
		"use strict"; 
		// Add events to check for swipe
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);



		this.sceneProps = game.add.group();

		this.thing1 = game.add.sprite(150, 150, 'test_image');
		this.thing1.anchor.setTo(0.5);
		this.thing2 = game.add.sprite(250, 250, 'test_image');
		this.thing2.anchor.setTo(0.5);
		this.thing3 = game.add.sprite(350, 350, 'test_image');
		this.thing3.anchor.setTo(0.5);



		
		let testButton = SpriteButton(50, 350, 'test_image');
		testButton.setBehaviors(
			function() { //On mouse over...
				console.log("Over");
				Tweenimate_ElasticScale(testButton.getSprite(), 2, 2, 1000);
			}, 
			function() { //On mouse off...
				console.log("Off");
				Tweenimate_ElasticScale(testButton.getSprite(), 1, 1, 1000);
			},
			function() { //On mouse down...
				console.log("Down");
				Tweenimate_ElasticScale(testButton.getSprite(), 4, 4, 1000);
			}, 
			function() { //On mouse up...
				console.log("Up");
				Tweenimate_ElasticScale(testButton.getSprite(), 4, 4, 1000);
			}
		);

		
		this.start_button1 = game.add.button(this.world.centerX, this.world.centerY, "test_image", test, this);
		this.start_button1.anchor.setTo(0.5);
		this.start_button1.clicked = false;
		



		//let spriteThing = game.add.sprite(500, 300, 'test_spritesheet');
		//let walk = spriteThing.animations.add('walk', [1, 2, 3], 12, true, true); // anim name, frames to play, fps, loop?, useNumericIndex?
		//spriteThing.animations.play('walk', 12, true);
		

		this.sceneProps.add(this.thing1);
		this.sceneProps.add(this.thing2);
		this.sceneProps.add(this.thing3);

		text_test = Text("Testing ", { font: "15px Arial", fill: 'white', align: "center" });
		text_test.setPartialColor(1, 2, "orange");

		// physics.applyPhysicsTo(thing1);
		// physics.setGravity(thing1, 0, 500);
		// physics.collideWorldBounds(thing1, true);
		// physics.setBounce(thing1, 0.8);

		EnterNewScene(this.sceneProps, TranslateTween("TOP_TO_CENTER", 1000, Phaser.Easing.Bounce.Out));

		this.positionComponents(game.width, game.height);
		this.initializeTiles();
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	},

	positionComponents: function(width, height) {
		ScaleSprite(this.start_button1, game.width, game.height, 100, 1, 1); 
		this.start_button1.x = this.world.centerX; 
		this.start_button1.y = this.world.centerY;
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
	    //this.game.state.start("GameState", false, false, this.game_details_data, this);
	    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	    //Tweenimate_Breathe(this.thing1, 1.5, 1.5, 1200);

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

	initializeTiles: function() {
		/* tiles = [ [], [], [], [] ];
		  		     []  []  []  []
		  	 	     []  []  []  []		*/


		this.tilesArray = [];
		this.tileGroup = game.add.group();
		let columnCount = 5;
		let rowCount = 4;

		for(let i = 0; i < columnCount; i++) {
			this.tilesArray[i] = [];
			for(let j = 0; j < rowCount; j++) { 
				let tileX = i * 15;
				let tileY = j * 15;
				let tile = this.tile(tileX, tileY, "test_image");
				//ScaleSprite(tile, game.width, game.height, 0, 1);
				this.tilesArray[i][j] = tile;
				this.tileGroup.add(tile.getSprite());
			}
		}

	},

	tile: function(x, y, spriteKey) {
		let obj = {};

		obj.tag = "TYPE_1";

		obj.tileButton = SpriteButton(50, 350, spriteKey);

		obj.sprite = obj.tileButton.getSprite();
		obj.sprite.x = x;
		obj.sprite.y = y;
		obj.sprite.anchor.set(0.5);

		obj.tileButton.setBehaviors(
			function() { //On mouse over...
				//console.log("Over");
			}, 
			function() { //On mouse off...
				//console.log("Off");
			},
			function() { //On mouse down...
				//console.log("Down");
				Tweenimate_ElasticScale(obj.sprite, 2, 2, 1000);
			}, 
			function() { //On mouse up...
				//console.log("Up");
				Tweenimate_ElasticScale(obj.sprite, 1, 1, 1000);
			}
		);

		obj.setPosition = function(x, y) {
			this.sprite.x = x;
			this.sprite.y = y;
		};
		obj.setScale = function(x, y) {
			this.sprite.scale.setTo(x, y);
		};
		obj.getSprite = function() {
			return this.sprite;
		};

		return obj;
	}

};


























