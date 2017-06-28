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

		let thing1 = game.add.sprite(250, 150, 'test_image');
		let thing2 = game.add.sprite(350, 150, 'test_image');
		let thing3 = game.add.sprite(450, 150, 'test_image');
		this.title = game.add.sprite(400, 100, 'test_image');
		this.title.anchor.setTo(0.5);

		this.sceneProps.add(thing1);
		this.sceneProps.add(thing2);
		this.sceneProps.add(thing3);
		this.sceneProps.add(this.title);

		
		
		

		//game.add.tween(sceneProps).to({x: 300, y: 0}, 2000, Phaser.Easing.Bounce.Out, true);

		//t = Transition('silver');
		//t.tweenTranslate(Phaser.Easing.Bounce.Out, 1400, "BOTTOM_TO_TOP");

		// Add events to check for swipe
		this.game.input.onDown.add(this.start_swipe, this);
		this.game.input.onUp.add(this.end_swipe, this);

		//player = Text("Testing ", { font: "15px Arial", fill: 'white', align: "center" });
		//player.setPartialColor(1, 2, "orange");


		//EnterNewScene(this.sceneProps, TranslateTween("TOP_TO_CENTER", 1000, Phaser.Easing.Bounce.Out));
		// this.addTitle();
		this.positionComponents(game.width, game.height);
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	}, 

	positionComponents: function(width, height) {
		this.title.x = 200;

		let isLandscape = (game.height / game.width < 1.3) ? true : false;
		if(isLandscape) {
			// let availableWidth = game.world.centerX;
			// let availableHeight = game.world.centerY;
			// let maxFontSize = 40;
			// let minFontSize = 20;

			// // Adjust the font size so it fills the space vertically.
		 //    if(text_test.height < availableHeight) {
			//     while(text_test.height < availableHeight && text_test.fontSize < maxFontSize) 
			//        	text_test.fontSize++;
			// } else if (text_test.height > availableHeight) {
			// 	while(text_test.height > availableHeight && text_test.fontSize > minFontSize) 
			// 		text_test.fontSize--;
			// }

			// text_test_style.wordWrapWidth = game.world.centerX;
			// text_test.setStyle(text_test_style);
			// text_test.lineSpacing = -text_test.fontSize;

			
		}
		else {
			
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
	    this.game.state.start("GameState", false, false, this.game_details_data, this);
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

	addTitle: function() {
		// text_test = game.add.text(game.world.centerX, game.world.centerY, 'This text is for testing.');

		let availableWidth = game.world.centerX;
		let availableHeight = game.world.centerY;

		text_test_style = { font: 'bold 20px Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: availableWidth };
	    text_test = game.add.text(0, 0, "This is a test. This is a test. This is a test. This is a test. ", text_test_style);

	    // text_test.lineSpacing = -text_test.fontSize * 0.3;

	    console.log("Making text: " + text_test.fontSize);

	    // Adjust the font size so it fills the space vertically.
	    if(text_test.height < availableHeight) {
		    while(text_test.height < availableHeight) 
		       	text_test.fontSize++;
		} else if (text_test.height > availableHeight) {
			while(text_test.height > availableHeight) 
				text_test.fontSize--;
		}

	    // text.anchor.set(0.5);

	    //	Center align
	    // text_test.anchor.set(0.5);
	    // text_test.align = 'center';

	    //	Font style
	    // text_test.font = 'Arial Black';
	    // text_test.fontSize = 30;
	    // text_test.fontWeight = 'bold';

	    //	Stroke color and thickness
	    // text_test.stroke = '#000000';
	    // text_test.strokeThickness = 0;

	    // var grd = text_test.context.createLinearGradient(0, 0, 0, text_test.height);

	    //  Add in 2 color stops
	    // grd.addColorStop(0, '#8ED6FF');   
	    // grd.addColorStop(1, '#004CB3');

	    //  And apply to the Text
	    // text_test.fill = grd;




	    // text_test.maxWidth = game.world.centerX;

	    this.sceneProps.add(text_test);
	}


















};

