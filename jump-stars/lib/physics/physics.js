Game.World = function(){
	this.container = [];
}

Game.World.prototype.add = function(object){
	this.container.push(object);
}

Game.World.prototype.update = function(){
	var length = this.container.length;
	for(var i = 0;i < length;i++){
		this.container[i];
	}
}

Game.World.prototype.getChildrenLength = function(){
	return this.container.length;
}

Game.World.prototype.constructor = Game.World;


Game.Physics = function(){
}

Game.Physics.prototype.constructor = Game.Physics;


var Vector2 = function(x,y){
	this.x = x||0;
	this.y = y||0;
}