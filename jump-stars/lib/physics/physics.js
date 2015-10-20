Game.World = function(){
	this.container = [];
	this.bounds = null;
	this.gravity = new Vector2(0,10);
}

Game.World.prototype.add = function(object){
	this.container.push(object);
}

Game.World.prototype.remove = function(object){
	var index = this.container.indexOf(object);
	if (index === -1) {
		return false;
	}
	this.container.splice(index, 1);
	return true;
}

Game.World.prototype.update = function(dt){
	var length = this.container.length;
	//更新速度
	for(var i = 0;i < length;i++){
		var object = this.container[i];
		object.rigidbody.velocity.x += object.rigidbody.force.x*dt;
		object.rigidbody.velocity.y += object.rigidbody.force.y*dt;
		object.x += object.rigidbody.velocity.x;
		object.y += object.rigidbody.velocity.y;
	}
	//碰撞检测
	for(var i = 0;i < length;i++){
		for(var j = 0;j < length;j++){
			if (j === i) {
				continue;
			};

		}
	}
}

Game.World.prototype.getChildrenLength = function(){
	return this.container.length;
}

Game.World.prototype.constructor = Game.World;


Game.Physics = function(world){
	this.world = world||null;
}

Game.Physics.prototype.addRigidbody = function(object,collider){
	object.rigidbody = new Rigidbody();
	object.rigidbody.collider = collider||new PIXI.Rectangle(0,0,object.width,object.height);
	object.rigidbody.force.add(this.world.gravity);
	this.world.add(object);
}

Game.Physics.prototype.removeRigidbody = function(object){
	delete object.rigidbody;
	this.world.remove(object);
}

Game.Physics.prototype.render = function(){

}

Game.Physics.prototype.constructor = Game.Physics;


var Vector2 = function(x,y){
	this.x = x||0;
	this.y = y||0;
}

Vector2.prototype.add = function(vector2){
	this.x += vector2.x;
	this.y += vector2.y;
	return this;
}

Vector2.prototype.sub = function(vector2){
	this.x -= vector2.x;
	this.y -= vector2.y;
	return this;
}

Vector2.prototype.constructor = Vector2;

var Rigidbody = function(){
	this.mass = 1;
	this.velocity = new Vector2();
	this.force = new Vector2();
	this.collider = null;
}