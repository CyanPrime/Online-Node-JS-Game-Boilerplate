var Player = function(id){
	this.id = id;
	this.lastUpdated = -1;
	this.lastPacketUpdate = -1;
	this.speed = 2;
	this.x = 640/2;
	this.y = 480/2;
	
	this.prevStatesMax = 15;
	this.prevStates = [];
	
	this.input = {up: false, down: false, left: false, right: false};
};

Player.prototype.update = function(savePrevState){
	
	if(savePrevState){
		//for rollback code
		this.prevStates.push(this);
		
		if(this.prevStates.length > this.prevStatesMax){
			this.prevStates.splice(0,1);
		}
	}
	if(this.input.up) this.y -= this.speed;
	if(this.input.down) this.y += this.speed;
	if(this.input.left) this.x -= this.speed;
	if(this.input.right) this.x += this.speed;
	
	this.lastUpdated = date.getTime();
}

Player.prototype.send = function(socket){
	socket.emit("player_update", { 
		id: this.id,
		x: this.x, 
		y: this.y,
		input: this.input,
		lastUpdated: this.lastUpdated,
		lastPacketUpdate: this.lastPacketUpdate,
	});
};

//function must be present for rollback to work.
createClientFromPacket = function(scene, data){
	if(!scene.idExists(data.id)){
		var temp = new Player(data.id);
		
		temp.x = data.x;
		temp.y = data.y;
		temp.lastUpdated = data.lastUpdated;
		temp.lastPacketUpdate = data.lastUpdated;
		
		if(data.input != undefined){
			temp.input = data.input;
		}
		
		return temp;
	}
	//return null;
}

updateClientFromPacket = function(scene, data){
	if(scene.idExists(data.id)){
			
		var temp = scene.getClientFromID(data.id);
	
		if(data.lastUpdated >= temp.lastPacketUpdate){
			//console.log(data);
			temp.x = data.x;
			temp.y = data.y;
			temp.lastPacketUpdate = data.lastUpdated;
			
			if(data.input != undefined){
				temp.input = data.input;
			}
		}
		
		return temp;
	}
	
	console.log("asdf");
}