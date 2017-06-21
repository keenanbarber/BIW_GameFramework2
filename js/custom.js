
/*_______________________________________
		TRANSITIONS 					|
_________________________________________
EXAMPLE
	o transitionTypes: 
		- Phaser.Easing.Bounce.Out
		- Phaser.Easing.Cubic.In
		- Phaser.Easing.Linear.None

	init()...
	exitPreviousScene(previousState.sceneProps, TranslateTween("CENTER_TO_LEFT", 1000, Phaser.Easing.Bounce.Out));

	create()...
	enterNewScene(this.sceneProps, TranslateTween("RIGHT_TO_CENTER", 1000, Phaser.Easing.Bounce.Out));
________________________________________*/
function TranslateTween(direction, duration, easing) {
	let obj = {};
	obj.tweenType = "TRANSLATE";
	obj.direction = direction;
	obj.duration = duration;
	obj.easing = easing;

	obj.start_x = 0;
	obj.start_y = 0;
	obj.end_x = 0; 
	obj.end_y = 0;
	switch(direction) {
		case "LEFT_TO_CENTER": 
			obj.start_x = -game.scale.width;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = 0;
			break; 
		case "RIGHT_TO_CENTER": 
			obj.start_x = game.scale.width;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = 0;
			break;
		case "TOP_TO_CENTER": 
			obj.start_x = 0;
			obj.start_y = -game.scale.height;
			obj.end_x = 0;
			obj.end_y = 0;
			break;
		case "BOTTOM_TO_CENTER": 
			obj.start_x = 0;
			obj.start_y = game.scale.height;
			obj.end_x = 0;
			obj.end_y = 0;
			break;
		case "CENTER_TO_LEFT": 
			obj.start_x = 0;
			obj.start_y = 0;
			obj.end_x = -game.scale.width;
			obj.end_y = 0;
			break;
		case "CENTER_TO_RIGHT": 
			obj.start_x = 0;
			obj.start_y = 0;
			obj.end_x = game.scale.width;
			obj.end_y = 0;
			break;
		case "CENTER_TO_TOP": 
			obj.start_x = 0;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = -game.scale.height;
			break;
		case "CENTER_TO_BOTTOM": 
			obj.start_x = 0;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = game.scale.height;
			break;
		default: 
			console.log("ERROR: Unable to perform that specific TRANSLATE transition.")
			obj.start_x = -game.scale.width;
			obj.start_y = 0;
			obj.end_x = 0;
			obj.end_y = 0;
	}
	return obj;
}
function FadeTween(direction, duration, easing) {
	let obj = {};
	obj.tweenType = "FADE";
	obj.direction = direction;
	obj.duration = duration;
	obj.easing = easing;

	obj.start_a = 0; 
	obj.end_a = 0;
	switch(direction) {
		case "FADE_OUT": 
			obj.start_a = 1;
			obj.end_a = 0;
			break; 
		case "FADE_IN": 
			obj.start_a = 0;
			obj.end_a = 1;
			break;
		default: 
			console.log("ERROR: Unable to perform that specific FADE transition.")
			obj.start_a = 1;
			obj.end_a = 0;
	}
	return obj;
}
function enterNewScene(newScenesProps, _tween) {
	let tween;
	switch(_tween.tweenType) {
		case "TRANSLATE": 
			newScenesProps.x = _tween.start_x;
			newScenesProps.y = _tween.start_y;
			tween = game.add.tween(newScenesProps).to({x: _tween.end_x, y: _tween.end_y}, _tween.duration, _tween.easing, true);
			break;
		case "FADE": 
			newScenesProps.alpha = _tween.start_a;
			tween = game.add.tween(newScenesProps).to({ alpha: _tween.end_a }, _tween.duration, _tween.easing, true);
			break;
		default: 
			console.log("ERROR: Failed to translate properly.");
	}
	
	//tween.onComplete.add(clearSceneProps, this);
}
function exitPreviousScene(previousScenesProps, _tween) {
	let tween;
	switch(_tween.tweenType) {
		case "TRANSLATE": 
			previousScenesProps.x = _tween.start_x;
			previousScenesProps.y = _tween.start_y;
			tween = game.add.tween(previousScenesProps).to({x: _tween.end_x, y: _tween.end_y}, _tween.duration, _tween.easing, true);
			break;
		case "FADE": 
			previousScenesProps.alpha = _tween.start_a;
			tween = game.add.tween(previousScenesProps).to({ alpha: _tween.end_a }, _tween.duration, _tween.easing, true);
			break;
		default: 
			console.log("ERROR: Failed to translate properly.");
	}
	tween.onComplete.add(function() { clearSceneProps(previousScenesProps); }, this);
}
function clearSceneProps(group) {
	group.removeAll();
}


/*_______________________________________
		TEXT 							|
_________________________________________
EXAMPLE: 

	player = Text("Testing ", { font: "15px Arial", fill: 'white', align: "center" });
	player.setPartialColor(1, 2, "orange");
_________________________________________*/
function Text(t, style) {
	let obj = {};
	obj.textObj = game.add.text(game.world.centerX, game.world.centerY, t, style);
    obj.textObj.anchor.set(0.5);

    obj.baseColor = (style.fill ? style.fill : 'white');
    obj.textObj.fill = obj.baseColor;
    
    obj.setFullColor = function(col) {
    	this.textObj.fill = col;
    	this.baseColor = col;
    };
    obj.setPartialColor = function(x1, x2, newColor) {
		this.textObj.addColor(newColor, x1);
	    this.textObj.addColor(this.baseColor, x2);
    };
    obj.getText = function() {
    	return this.textObj.text;
    };
    obj.getTextObject = function() {
    	return this.textObj;
    };
    return obj;
};


/*_______________________________________
		PHYSICS 						|
_________________________________________
EXAMPLE: 

	var physics = Physics();

	physics.applyPhysicsTo(thing1);
	physics.setGravity(thing1, 0, 500);
	physics.collideWorldBounds(thing1, true);
	physics.setBounce(thing1, 0.8);
*/

function Physics() {
	let obj = {};
    game.physics.startSystem(Phaser.Physics.ARCADE);

    obj.applyPhysicsTo = function(thing) {
    	game.physics.enable(thing, Phaser.Physics.ARCADE);
    };
    obj.beginCollisionBetween = function(thing1, thing2, whatToCallWhenCollides) {
    	game.physics.arcade.collide(ball, bricks, whatToCallWhenCollides, null, this);
    };
    obj.setBounce = function(thing, value) {
    	thing.body.bounce.set(value);
    };
    obj.setImmovable = function(thing, bool) {
    	thing.body.immovable = bool;
    };
    obj.setGravity = function(thing, xDir, yDir) {
    	thing.body.gravity.set(xDir, yDir);
    };
    obj.checkOverlap = function(thing1, thing2, whatToCallWhenOverlaps) {
    	return game.physics.arcade.overlap(thing1, thing2, whatToCallWhenOverlaps, null, this);
    };
    obj.collideWorldBounds = function(thing, bool) {
    	thing.body.collideWorldBounds = bool;
    };

    return obj;
};


/*_______________________________________
		RANDOM BETWEEN NUMBERS			|
_________________________________________*/
function RandomBetween(n1, n2) { // Inclusive
	return (n1-1) + Math.ceil(Math.random() * (n2-(n1-1)));
}


/*_______________________________________
		ACCELEROMETER					|
_________________________________________*/
function AccessAccelerometer(sendDataTo) {
	let obj = {};
	obj.x = 0; 
	obj.y = 0; 
	obj.z = 0;
	
	obj.storeData = function(e) {
		this.x = e.gamma;
		this.y = e.beta;
		this.z = e.alpha;
		//console.log("Accelerometer: x=" + this.x + ", y=" + this.y + ", z=" + this.z);
	};
	obj.getData = function() {
	    return {"x": this.x, 
				"y": this.y, 
				"z": this.z}
	};
	obj.startReading = function() {
		window.addEventListener("deviceorientation", this.storeData, true); 
	};
	return obj;
}



function test() {
	console.log("This is a test.");
}














