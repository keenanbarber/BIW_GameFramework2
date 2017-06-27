// Creates the game groups and prefabs

var MyGame = MyGame || {}; // Creates namespace if haven't already. 

var text_test;
var transitionRect;
var t;
var physics;

var mouseOverObj; 
var mouseOffObj;
var mouseDownObj; 
var mouseUpObj;

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

		// this.thing1 = game.add.sprite(150, 150, 'test_image');
		// this.thing1.anchor.setTo(0.5);
		// this.thing2 = game.add.sprite(250, 250, 'test_image');
		// this.thing2.anchor.setTo(0.5);
		// this.thing3 = game.add.sprite(350, 350, 'test_image');
		// this.thing3.anchor.setTo(0.5);

		// this.sceneProps.add(this.thing1);
		// this.sceneProps.add(this.thing2);
		// this.sceneProps.add(this.thing3);

		// this.square1 = game.add.sprite(150, 150, 'test_square');
		// this.square1.anchor.setTo(0.5);
		// ScaleSprite(this.square1, game.width/2, game.height/3, 40, 1);

		
		// let testButton = SpriteButton(50, 350, 'test_image');
		// testButton.setBehaviors(
		// 	function() { //On mouse over...
		// 		console.log("Over");
		// 		Tweenimate_ElasticScale(testButton.getSprite(), 2, 2, 1000);
		// 	}, 
		// 	function() { //On mouse off...
		// 		console.log("Off");
		// 		Tweenimate_ElasticScale(testButton.getSprite(), 1, 1, 1000);
		// 	},
		// 	function() { //On mouse down...
		// 		console.log("Down");
		// 		Tweenimate_ElasticScale(testButton.getSprite(), 4, 4, 1000);
		// 	}, 
		// 	function() { //On mouse up...
		// 		console.log("Up");
		// 		Tweenimate_ElasticScale(testButton.getSprite(), 4, 4, 1000);
		// 	}
		// );

		
		this.start_button1 = game.add.button(this.world.centerX, this.world.centerY, "test_image", test, this);
		this.start_button1.anchor.setTo(0.5);
		this.start_button1.clicked = false;
		

		this.tweenManager = GroupTweenManager();


		//let spriteThing = game.add.sprite(500, 300, 'test_spritesheet');
		//let walk = spriteThing.animations.add('walk', [1, 2, 3], 12, true, true); // anim name, frames to play, fps, loop?, useNumericIndex?
		//spriteThing.animations.play('walk', 12, true);
		



		text_test = Text("Testing ", { font: "15px Arial", fill: 'white', align: "center" });
		text_test.setPartialColor(1, 2, "orange");

		// physics.applyPhysicsTo(thing1);
		// physics.setGravity(thing1, 0, 500);
		// physics.collideWorldBounds(thing1, true);
		// physics.setBounce(thing1, 0.8);

		EnterNewScene(this.sceneProps, TranslateTween("TOP_TO_CENTER", 1000, Phaser.Easing.Bounce.Out));

		this.initializeTiles();
		this.positionComponents(game.width, game.height);
		this.printBoard();
		// this.scanBoard();
		//this.removeTile(4, 4);
	},

	update: function() {
		"use strict"; 
		//console.log("Update");
	},

	positionComponents: function(width, height) {
		let isLandscape = (game.height / game.width < 1.3) ? true : false;
		if(isLandscape) {
			var availableGridSpace = Math.min(width * 2 / 3, height);
			this.calculatedTileSize = (availableGridSpace * 0.9) / 6;
			this.verticalMargin = (height - 6 * this.calculatedTileSize) / 2;
			this.horizontalMargin = (width * 2 / 3 - 6 * this.calculatedTileSize) / 2;


			this.tileGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
			this.tileGroup.y = this.verticalMargin + this.calculatedTileSize/2;


			for(let i = 0; i < configuration.board_columns; i++) {
				for(let j = 0; j < configuration.board_rows; j++) { 
					let tileX = i * this.calculatedTileSize;
					let tileY = j * this.calculatedTileSize;

					this.tileArray[i][j].setPosition(tileX, tileY);
					ScaleSprite(this.tileArray[i][j].getSprite(), this.calculatedTileSize, this.calculatedTileSize, 2, 1);
				}
			}
		}
		else {
			var availableGridSpace = game.width;
			this.calculatedTileSize = (availableGridSpace * 0.8) / 6;
			this.horizontalMargin = (game.width - (6 * this.calculatedTileSize)) / 2;
			this.verticalMargin = (game.height - (6 * this.calculatedTileSize)) / 2;


			this.tileGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
			this.tileGroup.y = this.verticalMargin + this.calculatedTileSize/2;


			for(let i = 0; i < configuration.board_columns; i++) {
				for(let j = 0; j < configuration.board_rows; j++) { 
					let tileX = i * this.calculatedTileSize;
					let tileY = j * this.calculatedTileSize;

					this.tileArray[i][j].setPosition(tileX, tileY);
					ScaleSprite(this.tileArray[i][j].getSprite(), this.calculatedTileSize, this.calculatedTileSize, 2, 1);
				}
			}
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
	    //this.game.state.start("GameState", false, false, this.game_details_data, this);
	    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
	    //Tweenimate_Breathe(this.thing1, 1.5, 1.5, 1200);

		this.scanBoard();
	    //this.updateBoard();
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

	    this.updateBoard();
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

		var availableGridSpace = game.width;
		this.calculatedTileSize = (availableGridSpace * 0.8) / 6;

		this.horizontalMargin = (game.width - (6 * this.calculatedTileSize)) / 2;
		this.verticalMargin = (game.height - (6 * this.calculatedTileSize)) / 2;
		
		//console.log("WIDTH: " + game.width + ", MARGIN: " + this.horizontalMargin + ", BOARDSPACE: " + (6 * this.calculatedTileSize));

		this.tileArray = [];
		this.tileGroup = game.add.group();
		

		for(let i = 0; i < configuration.board_columns; i++) {
			this.tileArray[i] = [];
			for(let j = 0; j < configuration.board_rows; j++) { 
				let tileX = i * this.calculatedTileSize;
				let tileY = j * this.calculatedTileSize;
				let tile;


				let num = RandomBetween(0, 1);
				switch(num) {
					case 0: 
						tile = this.tile(tileX, tileY, "test_image", "TYPE_0");
						break;
					case 1: 
						tile = this.tile(tileX, tileY, "test_square", "TYPE_1");
						break;
					case 2: 
						tile = this.tile(tileX, tileY, "test_rect", "TYPE_2");
					default: 
						tile = this.tile(tileX, tileY, "test_image", "TYPE_0");
						break;
				}
				
				//ScaleSprite(tile, game.width, game.height, 0, 1);
				this.tileArray[i][j] = tile;
				this.tileGroup.add(tile.getSprite());

				ScaleSprite(tile.getSprite(), this.calculatedTileSize, this.calculatedTileSize, 0, 1);

			}
		}
		this.tileGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
		this.tileGroup.y = this.verticalMargin + this.calculatedTileSize/2;
	},

	tile: function(x, y, spriteKey, tileTag) {
		let obj = {};

		obj.tag = tileTag;

		obj.tileButton = SpriteButton(50, 350, spriteKey);

		obj.sprite = obj.tileButton.getSprite();
		obj.sprite.x = x;
		obj.sprite.y = y;
		obj.sprite.anchor.set(0.5);

		obj.mouseOver = false;
		obj.mouseOff = false;
		obj.mouseDown = false;
		obj.mouseUp = false;

		obj.tileButton.setBehaviors(
			function() { //On mouse over...
				//console.log("Over");
				mouseOverObj = obj;
				this.mouseOver = true;
				this.mouseOff = false;
				//Tweenimate_ElasticScale(obj.sprite, 1.5, 1.5, 1000);
			}, 
			function() { //On mouse off...
				//console.log("Off");
				mouseOffObj = obj;
				this.mouseOff = true;
				this.mouseOver = false;
				//Tweenimate_ElasticScale(obj.sprite, 1, 1, 1000);
			},
			function() { //On mouse down...
				//console.log("Down");
				mouseDownObj = obj;
				this.mouseDown = true;
				this.mouseUp = false;
				//Tweenimate_ElasticScale(obj.sprite, 1.5, 1.5, 1000);
			}, 
			function() { //On mouse up...
				console.log("Up");
				mouseUpObj = obj;
				this.mouseUp = true;
				this.mouseDown = false;
				//Tweenimate_ElasticScale(obj.sprite, 1, 1, 1000);

				Tweenimate_ElasticTranslate(mouseDownObj.getSprite(), mouseOverObj.getPositionX(), mouseOverObj.getPositionY(), 1000);
				Tweenimate_ElasticTranslate(mouseOverObj.getSprite(), mouseDownObj.getPositionX(), mouseDownObj.getPositionY(), 1000);

//Tweenimate_ElasticTranslate(mouseDownObj.getSprite(), mouseUpObj.getPositionX(), mouseUpObj.getPositionY(), 1000);
			}
		);

		obj.setPosition = function(x, y) {
			this.sprite.x = x;
			this.sprite.y = y;
		};
		obj.setScale = function(x, y) { this.sprite.scale.setTo(x, y); };
		obj.getSprite = function() { return this.sprite; };
		obj.getTag = function() { return this.tag; };
		obj.getPositionX = function() { return this.sprite.x; };
		obj.getPositionY = function() { return this.sprite.y; };

		return obj;
	}, 

	scanBoard: function() {
		let lastTileType = "";
		let currentTileType = "";

		let repeatedTiles = [];

		for(let i = 0; i < configuration.board_columns; i++) { // For each column...
			for(let j = 0; j < configuration.board_rows; j++) { // Go down the column...
				if(this.tileArray[i][j] != null) {
					lastTileType = currentTileType;
					currentTileType = this.tileArray[i][j].getTag();

					if(lastTileType === currentTileType) {
						repeatedTiles.push(new Phaser.Point(i, j));
						//console.log("Same...");
					}
					else {
						repeatedTiles = [new Phaser.Point(i, j)];
					}
					if(repeatedTiles.length >= 3) {
						// console.log("Found 3 or more in a row! (COL : " + i + ", " + j + ")");
						this.removeTiles(repeatedTiles);
						//repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
						
					}
				}
				else { // If null...
					repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
				}
			}
			repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
		}

		repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset

		for(let i = 0; i < configuration.board_rows; i++) { // For each row...
			for(let j = 0; j < configuration.board_columns; j++) { // Go across the row...
				if(this.tileArray[j][i] != null) {
					lastTileType = currentTileType;
					currentTileType = this.tileArray[j][i].getTag();

					if(lastTileType === currentTileType) {
						repeatedTiles.push(new Phaser.Point(j, i));
					}
					else {
						repeatedTiles = [new Phaser.Point(j, i)];
					}
					if(repeatedTiles.length >= 3) {
						// console.log("Found 3 or more in a row! (ROW : " + i + ", " + j + ")");
						this.removeTiles(repeatedTiles);
						//repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
					}
				}
				else { // If null...
					repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
				}
			}
			repeatedTiles = []; lastTileType = ""; currentTileType = ""; // Reset
		}
	}, 

	removeTiles: function(arr) {
		for(let i = 0; i < arr.length; i++) {
			this.removeTile(arr[i].x, arr[i].y);
		}
	},

	removeTile: function(col, row) {

		let target = this.tileArray[col][row].getSprite();

		let tween = game.add.tween(target.scale).to({ x: 0, y: 0 }, 600, Phaser.Easing.Linear.None, true);

		let obj = this;
		
		this.tweenManager.addTween(tween);
		this.tweenManager.callOnComplete(function() {
			console.log("All tweens completed.");
			// obj.updateBoard();
		});


		tween.onComplete.addOnce(function() {
			target.destroy();
			this.tileGroup.remove(this.tileArray[col][row]);
			this.tileArray[col][row] = null; 


			//this.updateColumn(col);

		}, this);


		
	}, 

	updateColumn: function(col) {
		// Go through the column and find the null space.
		for(let i = configuration.board_rows - 1; i > 0 ; i--) { // Starting at the bottom...
			if(this.tileArray[col][i] == null) {



				let tileX = col * this.calculatedTileSize;
				let tileY = i * this.calculatedTileSize;
				
				let tempI = i-1;
				while(this.tileArray[col][tempI] == null && tempI >= 0) {
					tempI--;
					if(tempI < 0)
						return;
				}


				let tween = game.add.tween(this.tileArray[col][tempI].getSprite()).to({ x: tileX, y: tileY }, 1000, Phaser.Easing.Bounce.Out, true);
				this.tweenManager.addTween(tween);

				let obj = this;

				this.tweenManager.callOnComplete(function() {
					console.log("All tweens completed.");
					// obj.scanBoard();
					obj.printBoard();
				});

				//this.tileArray[col][tempI].getSprite().x = tileX;
				//this.tileArray[col][tempI].getSprite().y = tileY;

				this.tileArray[col][i] = this.tileArray[col][tempI];
				this.tileArray[col][tempI] = null;

			}
		}
	}, 

	updateBoard: function() {
		for(let j = 0; j < configuration.board_columns; j++) {
			this.updateColumn(j);
		}
	}, 

	refillBoard: function() {

	}, 

	printBoard: function() {
		let str = "";

		for(let i = 0; i < configuration.board_rows; i++) {
			for(let j = 0; j < configuration.board_columns; j++) { 
				if(this.tileArray[j][i] == null) {
					str += "[_]";
				}
				else if(this.tileArray[j][i].getTag() === "TYPE_0") {
					str += "[0]";
				}
				else if(this.tileArray[j][i].getTag() === "TYPE_1") {
					str += "[1]";
				}
			}
			str += "\n";
		}

		console.log(str);
	}

};


























