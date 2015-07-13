/* 二维向量 */
game.Vector2 = function(x,y){
	this.x = x || 0;
	this.y = y || 0;
}

game.Vector2.prototype = {
	copy:function(){return new game.Vector2(this.x,this.y)},
	iadd:function(v){this.x+=v.x;this.y+=v.y;return this;s},
	muls:function(n){return new game.Vector2(this.x*n,this.y*n)}
}