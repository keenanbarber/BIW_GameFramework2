
/*_______________________________________
		TRANSITIONS 					|
_________________________________________
	ARGS
	o transitionTypes: 
		- Phaser.Easing.Bounce.Out
		- Phaser.Easing.Cubic.In
		- Phaser.Easing.Linear.None
________________________________________*/
function Transition(col) {
	let obj = {};
	obj.rect = new Phaser.Rectangle(0, 0, game.scale.width, game.scale.height); // <-- x, y, width, height
	obj.color = col;

	obj.tweenTranslate = function(transitionType, duration, direction) {
		let start_x = 0;
		let start_y = 0;
		let end_x = 0; 
		let end_y = 0;
		switch(direction) {
			case "LEFT_TO_CENTER": 
				start_x = -game.scale.width;
				start_y = 0;
				end_x = 0;
				end_y = 0;
				break; 
			case "RIGHT_TO_CENTER": 
				start_x = game.scale.width;
				start_y = 0;
				end_x = 0;
				end_y = 0;
				break;
			case "TOP_TO_CENTER": 
				start_x = 0;
				start_y = -game.scale.height;
				end_x = 0;
				end_y = 0;
				break;
			case "BOTTOM_TO_CENTER": 
				start_x = 0;
				start_y = game.scale.height;
				end_x = 0;
				end_y = 0;
				break;
			case "CENTER_TO_LEFT": 
				start_x = 0;
				start_y = 0;
				end_x = -game.scale.width;
				end_y = 0;
				break;
			default: 
				console.log("ERROR: Unable to perform that specific translate transition.")
				start_x = -game.scale.width;
				start_y = 0;
				end_x = 0;
				end_y = 0;
		}

		this.rect.x = start_x;
		this.rect.y = start_y;
		game.add.tween(this.rect).to({x: end_x, y: end_y}, duration, transitionType, true);
	};
	/* obj.tweenFade = function(transitionType, duration, direction) { 		<----- DOESN'T WORK
		let start_a = 0;
		let end_a = 0;
		switch(direction) {
			case "VISIBLE_TO_INVISIBLE": 
				start_a = 1;
				end_a = 0;
				break; 
			case "INVISIBLE_TO_VISIBLE": 
				start_a = 0;
				end_a = 1;
				break;
			default: 
				console.log("ERROR: Unable to perform that specific fade transition.")
				start_a = 1;
				end_a = 0;
		}
		this.rect.alpha = start_a;
		//console.log(this.rect.alpha + ", " + start_a + ", " + end_a);
		game.add.tween(this.rect).to({alpha: end_a}, duration, transitionType, true);
	}; */
	obj.render = function() {
		game.debug.geom(this.rect, this.color);
	};
	return obj;
}


/*_______________________________________
		TEXT 							|
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
_________________________________________*/
function Physics() {
	let obj = {};
    game.physics.startSystem(Phaser.Physics.ARCADE);

    obj.applyPhysicsTo = function(thing) {
    	thing.physicsBodyType = Phaser.Physics.ARCADE;
    };
    obj.beginCollisionBetween = function(thing1, thing2, whatToCallWhenCollides) {
    	game.physics.arcade.collide(ball, bricks, whatToCallWhenCollides, null, this);
    };
    obj.setBounce = function(thing, value) {
    	thing.body.bounce = value;
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














