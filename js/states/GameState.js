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

var selectedTile1;
var selectedTile2;

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
		this.scanBoard();
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
					ScaleSprite(this.tileArray[i][j].getSprite(), this.calculatedTileSize, this.calculatedTileSize, configuration.tile_padding, 1);
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
					ScaleSprite(this.tileArray[i][j].getSprite(), this.calculatedTileSize, this.calculatedTileSize, configuration.tile_padding, 1);
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

		// this.scanBoard();
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

	    // this.updateBoard();
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
				
				let tile = this.placeTile(tileX, tileY);
				
				//ScaleSprite(tile, game.width, game.height, 0, 1);
				this.tileArray[i][j] = tile;
				this.tileGroup.add(tile.getSprite());
				tile.setArrayPosition(i, j);

				ScaleSprite(tile.getSprite(), this.calculatedTileSize, this.calculatedTileSize, configuration.tile_padding, 1);

			}
		}
		this.tileGroup.x = this.horizontalMargin + this.calculatedTileSize/2;
		this.tileGroup.y = this.verticalMargin + this.calculatedTileSize/2;
	},

	placeTile: function(x, y) {
		
		let tile;
		let num = RandomBetween(0, 4);
		switch(num) {
			case 0: 
				tile = this.tile(this, x, y, "yellow_square", "TYPE_0");
				break;
			case 1: 
				tile = this.tile(this, x, y, "blue_square", "TYPE_1");
				break;
			case 2: 
				tile = this.tile(this, x, y, "red_square", "TYPE_2");
				break;
			case 3: 
				tile = this.tile(this, x, y, "green_square", "TYPE_3");
				break;
			case 4: 
				tile = this.tile(this, x, y, "purple_square", "TYPE_4");
				break;
			default: 
				tile = this.tile(this, x, y, "yellow_square", "TYPE_0");
				break;
		}
		return tile;
	},

	tile: function(theState, x, y, spriteKey, tileTag) {
		let obj = {};
		obj.theState = theState;

		obj.tag = tileTag;

		obj.tileButton = SpriteButton(50, 350, spriteKey);

		obj.sprite = obj.tileButton.getSprite();
		obj.sprite.x = x;
		obj.sprite.y = y;
		obj.sprite.anchor.set(0.5);

		obj.arrayPos = new Phaser.Point(0, 0);

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
				console.log("Down");
				mouseDownObj = obj;
				this.mouseDown = true;
				this.mouseUp = false;
				//Tweenimate_ElasticScale(obj.sprite, 1.5, 1.5, 1000);

				if(selectedTile1 == null) {
					selectedTile1 = obj;
					console.log("Found: " + selectedTile1);
				} 
				else {
					selectedTile2 = obj;
					console.log("Found: " + selectedTile2);

					theState.swapTiles(selectedTile1, selectedTile2);

					selectedTile1 = null; 
					selectedTile2 = null;
				}

			}, 
			function() { //On mouse up...
				console.log("Up");
				mouseUpObj = obj;
				this.mouseUp = true;
				this.mouseDown = false;
				//Tweenimate_ElasticScale(obj.sprite, 1, 1, 1000);

				

//Tweenimate_ElasticTranslate(mouseDownObj.getSprite(), mouseUpObj.getPositionX(), mouseUpObj.getPositionY(), 1000);
			}
		);

		obj.setPosition = function(x, y) {
			this.sprite.x = x;
			this.sprite.y = y;
		};
		obj.setArrayPosition = function(x, y) {
			this.arrayPos = new Phaser.Point(x, y);
		};
		obj.setScale = function(x, y) { this.sprite.scale.setTo(x, y); };
		obj.getSprite = function() { return this.sprite; };
		obj.getTag = function() { return this.tag; };
		obj.getPositionX = function() { return this.sprite.x; };
		obj.getPositionY = function() { return this.sprite.y; };

		return obj;
	}, 

	swapTiles: function(t1, t2) {
		let x1 = t1.arrayPos.x;
		let y1 = t1.arrayPos.y;
		let x2 = t2.arrayPos.x;
		let y2 = t2.arrayPos.y;


		let temp = this.tileArray[x1][y1];
		this.tileArray[x1][y1] = this.tileArray[x2][y2];
		this.tileArray[x1][y1].setArrayPosition(x1, y1);

		this.tileArray[x2][y2] = temp;
		this.tileArray[x2][y2].setArrayPosition(x2, y2);

		console.log("(" + this.tileArray[x1][y1].getPositionX() + ", " + this.tileArray[x1][y1].getPositionY() + ")");
		console.log("(" + this.tileArray[x2][y2].getPositionX() + ", " + this.tileArray[x2][y2].getPositionY() + ")");
	
		let tween1 = game.add.tween(this.tileArray[x1][y1].getSprite()).to({ x: this.tileArray[x2][y2].getPositionX(), y: this.tileArray[x2][y2].getPositionY() }, 1000, Phaser.Easing.Elastic.Out, true);
		let tween2 = game.add.tween(this.tileArray[x2][y2].getSprite()).to({ x: this.tileArray[x1][y1].getPositionX(), y: this.tileArray[x1][y1].getPositionY() }, 1000, Phaser.Easing.Elastic.Out, true);

		this.tweenManager.addTween(tween1);
		this.tweenManager.addTween(tween2);
		
		let obj = this;
		this.tweenManager.callOnComplete(function() {
			console.log("All tweens completed.");
			obj.scanBoard();
		});

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

		let obj = this;
		this.tweenManager.callOnComplete(function() {
			console.log("All tweens completed.");
			obj.updateBoard();
		});
	},

	removeTile: function(col, row) {

		let target = this.tileArray[col][row].getSprite();

		let tween = game.add.tween(target.scale).to({ x: 0, y: 0 }, 600, Phaser.Easing.Linear.None, true);

		
		
		this.tweenManager.addTween(tween);
		


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
				this.tileArray[col][tempI].setArrayPosition(col, i);
				this.tweenManager.addTween(tween);

				this.tileArray[col][i] = this.tileArray[col][tempI];
				this.tileArray[col][tempI] = null;

			}
		}


	}, 

	updateBoard: function() {
		for(let j = 0; j < configuration.board_columns; j++) {
			this.updateColumn(j);
		}
		this.refillBoard();

		let obj = this;
		this.tweenManager.callOnComplete(function() {
			console.log("All tweens completed.");
			
			obj.printBoard();
			obj.scanBoard();
		});
	}, 

	refillBoard: function() {

		// console.log("Refilling...");
		for(let col = 0; col < configuration.board_columns; col++) {
			let row = 0;
			while(this.tileArray[col][row] == null && row < configuration.board_rows) {
				// console.log("Found null tile...");
				row++;
			} let nullTileCount = row;
			if(nullTileCount != 0) {
				// console.log(nullTileCount + " tiles needed in column: " + col);
				for(let i = 0; i < nullTileCount; i++) {


					let tileX = col * this.calculatedTileSize;
					let tileY = i * this.calculatedTileSize;
					let tile = this.placeTile(tileX, tileY - game.height);


					this.tileArray[col][i] = tile;
					this.tileGroup.add(tile.getSprite());

					ScaleSprite(tile.getSprite(), this.calculatedTileSize, this.calculatedTileSize, configuration.tile_padding, 1);

					let tween = game.add.tween(tile.getSprite()).to({ x: tileX, y: tileY }, 1000, Phaser.Easing.Bounce.Out, true);
					tile.setArrayPosition(col, i);
					this.tweenManager.addTween(tween);

				}
			}
		}


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
				else if(this.tileArray[j][i].getTag() === "TYPE_2") {
					str += "[2]";
				}
				else if(this.tileArray[j][i].getTag() === "TYPE_3") {
					str += "[3]";
				}
				else if(this.tileArray[j][i].getTag() === "TYPE_4") {
					str += "[4]";
				}
			}
			str += "\n";
		}

		console.log(str);
	}

};


























