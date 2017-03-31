this.date = new Date();

//easy way to make images
var makeImg = function(str){
	var temp = new Image();
	temp.src = str;
	temp.onload = function() {
		temp.w = this.width
		temp.h = this.height;
		console.log(str + ' loaded');
	}
	console.log(str + ' -- ' + temp.w + 'x' + temp.h);
	return temp;
}

//the current client's game object browsing the page
var me;
//the current scene
var scene = new Scene();

//using JQuery we check if any of our important keys are down (the arrows)
$( document ).keydown(function( event ) {
	if(!me.disconnected){
		if(event.keyCode == 37) me.input.left = true;
		if(event.keyCode == 39) me.input.right = true;
		if(event.keyCode == 38) me.input.up = true;
		if(event.keyCode == 40) me.input.down = true;
	}
});

//using JQuery we check if any of our important keys are up (the arrows)
$( document ).keyup(function( event ) {
	if(!me.disconnected){
		if(event.keyCode == 37) me.input.left = false;
		if(event.keyCode == 39) me.input.right = false;
		if(event.keyCode == 38) me.input.up = false;
		if(event.keyCode == 40) me.input.down = false;
	}
});

$( document ).ready(function() {
	
	var socket = io();
	var ctx = $("#screen")[0].getContext('2d');
	
	//socket.io stuff: create a new player for the client if they've requested one.
	socket.on('get_player', function(msg){
		console.log(msg.id);
		me = new Player(msg.id);
	});
	
	socket.on('quit_player', function(msg){
		if(scene.disconnectClientFromID(msg.id) >= 0) console.log(msg.id);
	});
	
	//socket.io stuff: get the current "key frame" from the other players
	socket.on('get_key', function(msg){
		//loop through all the players that we've been sent keyframes for.
		for(var i = 0; i < msg.length; i++){
			
			//if it's a new player: create a new player
			var np = createClientFromPacket(scene, msg[i]);
			if(np != null) scene.clients.push(np);
			
			//if it's already a player, just check if it needs to be updated, and if it does update it.
			var updatedPlayer = updateClientFromPacket(scene, msg[i]);
			if(updatedPlayer != null) scene.replaceClientFromID(updatedPlayer.id,updatedPlayer);
		}
	});
	
	socket.emit('log', "Connection test succeded.");
	socket.emit('req_player', "Please give a character to " + socket.id);
		
	//the main loop
	var mainLoop = function(){
		if(me != undefined){		
			me.update(true);
			me.send(socket);
		}
		
		scene.update();
		scene.draw(ctx);
	};

	var updateInterval = setInterval(mainLoop, 1000 / 60);
});