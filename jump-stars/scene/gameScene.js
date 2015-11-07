//游戏场景
function gameScene(){
	this.mc = null;
	this.init = function(){
		var hero = $Data.heroes['luffy'];
		var textures = this.createTexures('luffy_stand',6);
		var mc = new PIXI.extras.MovieClip(textures);
		var gf = new PIXI.Graphics();
		gf.lineStyle(1,0xff0000,1);
		gf.drawRect(0,0,mc.width,mc.height);
		mc.addChild(gf);
		mc.x = mc.y = 100;
		mc.play();
		mc.animationSpeed = 0.3;
		Game.world.addMap(Game.map);
		Game.stage.addChild(Game.map);
		Game.stage.addChild(mc);
		Game.physics.addRigidbody(mc);
		this.mc = mc;
		this.mc.rigidbody.addForce(new Vector2(2,0));
		var wall = new PIXI.Graphics();
		wall.width = 50;
		wall.height = Game.viewHeight;
		wall.x = -50;
		Game.physics.addRigidbody(wall,new PIXI.Rectangle(0,0,50,Game.viewHeight),true);
		var wall2 = new PIXI.Graphics();
		wall2.width = 50;
		wall2.height = Game.viewHeight;
		wall2.x = Game.viewWidth;
		wall2.beginFill(0xff0000,1);
		wall2.drawRect(0,0,50,Game.viewHeight);
		wall2.endFill();
		Game.physics.addRigidbody(wall2,new PIXI.Rectangle(0,0,50,Game.viewHeight),true);
		Game.stage.addChild(wall2);
		window.mc = mc;
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