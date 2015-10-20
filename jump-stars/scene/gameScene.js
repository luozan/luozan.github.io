//游戏场景
function gameScene(){
	this.init = function(){
		var hero = $Data.heroes['luffy'];
		var textures = this.createTexures('luffy_stand',6);
		var mc = new PIXI.MovieClip(textures);
		mc.anchorX = mc.anchorY = 0.5;
		mc.x = mc.y = 50;
		mc.play();
		mc.animationSpeed = 0.3;
		console.log(Game.map);
		Game.stage.addChild(Game.map);
		Game.stage.addChild(mc);
		Game.physics.addRigidbody(mc);
		Game.world.add(mc);
	}

	this.update = function(){

	}

	this.createSprite = function(id,anchorX,anchorY,x,y){
		var sprite = PIXI.Sprite.fromImage($Config.resource[id]);
		sprite.anchor.x = anchorX||0;
		sprite.anchor.y = anchorY||0;
		sprite.x = x||0;
		sprite.y = y||0;
		return sprite; 
	}

	this.createTexures = function(id,totalFrames){
		var textures = [];
		for(var i = 0;i < totalFrames;i++){
			var texture = PIXI.Texture.fromFrame(id+'_'+i+'.png');
			textures.push(texture);
		}
		return textures;
	}
}