//imports start

//TODO: explain
var fs = require('fs');

//TODO: Explain
var path = require('path');

//Express sllows us to quickly and easily make a node.js web server.
var express = require('express');
var app = express();

//TODO: Explain
var http = require('http').Server(app);
var io = require('socket.io')({
    "transports" : ["xhr-polling"],
    "polling duration" : 10
}).listen(http);

//our port var will contain eather a special variable for Hiroku, or 44444;
var port = process.env.PORT || 44444;

var clients_to_update = [];

var checkIfIDExists = function(id){
	for(var i = 0; i < clients_to_update.length; i++){
		console.log(clients_to_update[i]);
		if(clients_to_update[i].id == id) return true;
	}
	
	return false;
}

var setFromID = function(msg){
	for(var i = 0; i < clients_to_update.length; i++){
		console.log(clients_to_update[i]);
		if(clients_to_update[i].id == msg.id) clients_to_update[i] = msg;
	}
	
	return false;
}

//setup web pages
//this is what connects the public folder in our project to the root of our webserver
app.use(express.static(__dirname + '/public'));


//localhost:44444/game
app.get('/game', function(req, res){
  res.sendFile(__dirname + '/game.htm');
});

//localhost:44444
app.get('/', function(req, res){
  res.sendFile(__dirname + '/title.htm');
});

io.on('connection', function (socket) {
	console.log(socket.id + ' connected');

	socket.on('log', function(msg){
		console.log(socket.id + '[log]: ' + msg);
	});
	
	socket.on('req_player', function(msg){
		io.to(socket.id).emit('get_player', { id: socket.id });
	});
	
	socket.on('player_update', function(msg){
		if(!checkIfIDExists(msg.id)) clients_to_update.push(msg);
		else setFromID(msg);
 	});
	
	socket.on('disconnect', function(){
		/*if(sockets[socket.id] !== undefined){
			sockets[socket.id] = undefined;
		}*/
		io.emit('quit_player', { id: socket.id });
		console.log(socket.id + ' disconnected');
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var mainLoop = function(){
	if(clients_to_update.length > 0 ){
		io.emit('get_key', clients_to_update);
		clients_to_update = [];
	}
};

var updateInterval = setInterval(mainLoop, 1000 / 60);