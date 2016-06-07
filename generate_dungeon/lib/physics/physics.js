Game.World = function(){
	this.container = [];
	this.bounds = null;
	this.gravity = new Vector2(0,10);
	this.physics = null;
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

Game.World.prototype.addMap = function(map){
	for(var i = 0;i < map.children.length;i++){
		var layer = map.children[i];
		for(var j = 0;j < layer.children.length;j++){
			var tile = layer.children[j];
			if (!tile.collider) {
				continue;
			}
			this.physics.addRigidbody(tile,tile.collider[0],true);
		}
	}
}

Game.World.prototype.update = function(dt){
	var length = this.container.length;
	//更新速度
	for(var i = 0;i < length;i++){
		var object = this.container[i];
		if (object.static) {
			continue;
		};
		//碰撞检测
		var collider = object.rigidbody.collider;
		var velocityX = object.rigidbody.velocity.x + object.rigidbody.force.x*dt;
		var velocityY = object.rigidbody.velocity.y + object.rigidbody.force.y*dt;
		object.rigidbody.velocity.x = velocityX;
		object.rigidbody.velocity.y = velocityY;
		collider.x = object.x + velocityX;
		collider.y = object.y + velocityY;
		for(var j = 0;j < length;j++){
			if (j === i) {
				continue;
			};
			var object2 = this.container[j];
			var collider2 = object2.rigidbody.collider;
			collider2.x = object2.x;
			collider2.y = object2.y;
			if (Game.Physics.hitTest(collider,collider2)){
				// object.rigidbody.velocity.x = 0;
				// object.rigidbody.velocity.y = 0;
				Game.Physics.resolve(collider,collider2);
			}
		}
		object.x = collider.x;
		object.y = collider.y;
	}
	// for(var i = 0;i < length;i++){
	// 	var object = this.container[i];
	// 	if (object.static) {
	// 		continue;
	// 	};
	// }
}

Game.World.prototype.getChildrenLength = function(){
	return this.container.length;
}

Game.World.prototype.constructor = Game.World;


Game.Physics = function(world){
	//常量
	this.THRESHOLD = 0.1;

	this.world = world||null;
	this.world.physics = this;
}

Game.Physics.prototype.addRigidbody = function(object,collider,isStatic){
	object.rigidbody = new Rigidbody();
	object.rigidbody.collider = collider||new PIXI.Rectangle(0,0,object.width,object.height);
	object.rigidbody.collider.body = object;
	object.rigidbody.force.add(this.world.gravity);
	if(isStatic === true){
		object.static = true;
	}
	this.world.add(object);
}

Game.Physics.prototype.removeRigidbody = function(object){
	delete object.rigidbody;
	this.world.remove(object);
}

Game.Physics.prototype.render = function(){

}

Game.Physics.hitTestWithRectangle = function(collider1,collider2){
	if(collider2 instanceof PIXI.Rectangle){
		if(
			collider1.contains(collider2.x,collider2.y)
			||collider1.contains(collider2.x,collider2.y+collider2.height)
			||collider1.contains(collider2.x+collider2.width,collider2.y)
			||collider1.contains(collider2.x+collider2.width,collider2.y+collider2.height)
			||collider2.contains(collider1.x,collider1.y)
			||collider2.contains(collider1.x+collider1.width,collider1.y)
			||collider2.contains(collider1.x+collider1.width,collider1.y+collider1.height)
			||collider2.contains(collider1.x,collider1.y+collider1.height)
		){
			return true;
		}
		else{
			return false;
		}
	}
	else if(collider2 instanceof PIXI.Circle){

	}
}

Game.Physics.hitTestWithCircle = function(collider1,collider2){
	if(collider2 instanceof PIXI.Rectangle){

	}
	else if(collider2 instanceof PIXI.Circle){
		var distance = collider1.radius+collider2.radius;
		if(Math.sqrt(Math.pow(collider1.x - collider2.x,2)+Math.pow(collider1.y - collider2.y,2)) <= distance){
			return true;
		}
		else{
			return false;
		}
	}
}

Game.Physics.hitTest = function(collider1,collider2){
	if (collider1 instanceof PIXI.Rectangle) {
		return Game.Physics.hitTestWithRectangle(collider1,collider2);
	}
	else if(collider1 instanceof PIXI.Circle){
		return Game.Physics.hitTestWithCircle(collider1,collider2);
	}
}

//暂只实现矩形与矩形碰撞后复原
Game.Physics.resolve = function(collider1,collider2){
	var collider1MidPointX = collider1.x+collider1.width/2;
	var collider1MidPointY = collider1.y+collider1.height/2;
	var collider2MidPointX = collider2.x+collider2.width/2;
	var collider2MidPointY = collider2.y+collider2.height/2; 

	var dx = (collider1MidPointX - collider2MidPointX)/collider2.width/2;
	var dy = (collider1MidPointY - collider2MidPointY)/collider2.height/2;

	var absDX = Math.abs(dx);
	var absDY = Math.abs(dy);
	var body = collider1.body;
	if (Math.abs(absDX-absDY) < this.THRESHOLD){
		if (dx < 0) {
			collider1.x = collider2.x - collider1.width;
		}else{
			collider1.x = collider2.x + collider2.width;
		}

		if (dy < 0) {
			collider1.y = collider2.y - collider1.height; 
		}
		else{
			collider1.y = collider2.y+collider2.height;
		}

		if (Math.random() < 0.5) {
			body.rigidbody.velocity.x = 0;
		}
		else{
			body.rigidbody.velocity.y = 0;
		}
	}
	else if(absDX > absDY){
		console.log(collider1.x,collider2.x,absDX);
		if (dx < 0) {
			collider1.x = collider2.x - collider1.width;
		}else{
			collider1.x = collider2.x + collider2.width;
		}

		body.rigidbody.velocity.x = 0;		
	}
	else{
		if (dy < 0) {
			collider1.y = collider2.y - collider1.height; 
		}
		else{
			collider1.y = collider2.y+collider2.height;
		}

		body.rigidbody.velocity.y = 0;
	}



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
	this.static = false;
	this.mass = 1;
	this.velocity = new Vector2();
	this.force = new Vector2();
	this.collider = null;
}

Rigidbody.prototype.constructor = Rigidbody;

Rigidbody.prototype.addForce = function(vector2){
	this.force.add(vector2);
}