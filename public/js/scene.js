var Scene = function(){
	this.clients = [];
	
	this.type = "scene";
};

Scene.prototype.update = function(){
	for(var i = 0; i < this.clients.length; i++){
		this.clients[i].update(false);
	}
}

Scene.prototype.idExists = function(id){
	for(var i = 0; i < this.clients.length; i++){
		var c = this.clients[i];

		if(c != undefined){
			if(c.id == id) return true;
		}
	}
	
	return false;
}

Scene.prototype.getClientFromID = function(id){
	for(var i = 0; i < this.clients.length; i++){
		var c = this.clients[i];

		if(c != undefined){
			if(c.id == id) return c;
		}
	}
	
	return null;
}

Scene.prototype.replaceClientFromID = function(id, nc){
	for(var i = 0; i < this.clients.length; i++){
		if(nc != undefined){
			if(this.clients[i].id == id) this.clients[i] = nc;
		}
	}
}

Scene.prototype.draw = function(ctx){
	ctx.clearRect(0,0,640,480);
	
	ctx.fillStyle = "#00ffff";
	for(var i = 0; i < this.clients.length; i++){
		
		var c = this.clients[i];
		
		if(c != undefined){
			var myID = "default";
			if(me != undefined) myID =  me.id;
			if(c.id != myID){
				ctx.fillRect(c.x, c.y, 32,32);
			}
		}
		
		else console.log("c is undefined.");
	}
	
	if(me != undefined){
		ctx.fillStyle = "#ffff00";
		ctx.fillRect(me.x, me.y, 32,32);
	}
};