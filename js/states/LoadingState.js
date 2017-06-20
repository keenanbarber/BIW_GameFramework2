// Loads all of the game assets and starts the Level State.

var MyGame = MyGame || {}; /* Created namespace if it hasn't yet been created. */

MyGame.LoadingState = function() {
	"use strict";
	Phaser.State.call(this);
};

MyGame.prototype = Object.create(Phaser.State.prototype);
MyGame.prototype.constructor = MyGame.LoadingState;

MyGame.LoadingState.prototype.init = function(game_details_data) { 
	// Recieves game_details_data from BootState and stores it. 
	"use strict";
	this.game_details_data = game_details_data;
};

MyGame.LoadingState.prototype.preload = function() {
	"use strict"; 

	var user_details, user_detail_key, detail;
	user_details = this.game_details_data.user_details;
	for(user_detail_key in user_details) {
		if(user_details.hasOwnProperty(user_detail_key)) { // Makes sure the key exists in the assets.
			detail = user_details[user_detail_key];

			switch(user_detail_key) {
				case "name": 
					//this.load.image(asset_key, asset.source);
					console.log("Found \'" + detail + "\' in the json file.");
					break; 
				case "points": 
					//this.load.spritesheet(asset_key, asset_source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
					console.log("Found \'" + detail + "\' in the json file.");
					break;
			}
		}
	}


};

MyGame.LoadingState.prototype.create = function() {
	"use strict"; 
	this.game.state.start("GameState", true, false, this.game_details_data);
};