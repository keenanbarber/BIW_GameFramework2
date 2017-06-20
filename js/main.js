var MyGame = MyGame || {};
var device;
var deviceOrientation;


var game = new Phaser.Game(600, 400, Phaser.AUTO);



game.state.add("BootState", new MyGame.BootState());
game.state.add("LoadingState", new MyGame.LoadingState());
game.state.add("GameState", new MyGame.GameState());
game.state.start("BootState", true, false, "assets/json/game_details.json", 'game_phaser');




