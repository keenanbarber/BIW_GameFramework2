var MyGame = MyGame || {};
var device;
var deviceOrientation;



var configuration = {
	'canvas_width_max' : 2048,					
	'canvas_width' : 1000,						
	'canvas_height_max' : 2048,				
	'canvas_height' : 650,						
	'scale_ratio' : 1,							
	'aspect_ratio' : 1, 
	'board_columns' : 6, 
	'board_rows' : 6
};


UpdateScreenInfo();

var game = new Phaser.Game(configuration.canvas_width, configuration.canvas_height, Phaser.AUTO);


game.state.add("BootState", new MyGame.BootState());
game.state.add("LoadingState", new MyGame.LoadingState());
game.state.add("MenuState", new MyGame.MenuState());
game.state.add("GameState", new MyGame.GameState());
game.state.start("BootState", true, false, "assets/json/game_details.json", 'game_phaser');




function UpdateScreenInfo() {
	configuration.canvas_width = window.screen.availWidth * window.devicePixelRatio;
	configuration.canvas_height = window.screen.availHeight * window.devicePixelRatio;
	configuration.aspect_ratio = configuration.canvas_width / configuration.canvas_height;
	if (configuration.aspect_ratio < 1) configuration.scale_ratio = configuration.canvas_height / configuration.canvas_height_max;
	else configuration.scale_ratio = configuration.canvas_width / configuration.canvas_width_max;
}