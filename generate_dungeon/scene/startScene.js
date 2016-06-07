//游戏场景
function startScene(){

	PIXI.Container.call(this);

	this.init = function(){
		var self = this;
		Game.renderer.backgroundColor = 0x0;
		var mapWidth = 50;
		var mapHeight = 50; 
		//随机生成地牢
		var dungeon = new Dungeon(mapWidth,mapHeight,2,2);
		dungeon.scene = this;
		var map = dungeon.create();
		window.dungeon = dungeon;

		var graphics = new PIXI.Graphics();
		//绘制地图
		for(var x = 0; x < mapWidth;x++){
			for(var y = 0;y < mapHeight;y++){
				switch(map[x][y]){
					case mapType.Floor:
						graphics.beginFill(0xFFFFFF);
		    			graphics.drawRect(x*10,y*10,10,10);
		    			graphics.endFill();
		    			break;
		    		case mapType.Wall:
		    			graphics.beginFill(0x888888);
		    			graphics.drawRect(x*10,y*10,10,10);
		    			graphics.endFill();
		    			break;
		    		case mapType.test:
		    			graphics.beginFill(0x0);
		    			graphics.drawRect(x*10,y*10,10,10);
		    			graphics.endFill();
		    			break;
		    		case mapType.test2:
		    			graphics.beginFill(0x00ff00);
		    			graphics.drawRect(x*10,y*10,10,10);
		    			graphics.endFill();
		    			break;
				}
			}
		}
		
		this.addChild(graphics);
		//重新生成按钮
		var button = document.getElementById("button");
		button.style.display = "block";
		button.onclick = function(){
			map = dungeon.create();
			self.removeChildren();
			for(var x = 0; x < mapWidth;x++){
				for(var y = 0;y < mapHeight;y++){
					switch(map[x][y]){
						case mapType.Floor:
							graphics.beginFill(0xFFFFFF);
			    			graphics.drawRect(x*10,y*10,10,10);
			    			graphics.endFill();
			    			break;
			    		case mapType.Wall:
			    			graphics.beginFill(0x888888);
			    			graphics.drawRect(x*10,y*10,10,10);
			    			graphics.endFill();
			    			break;
			    		case mapType.test:
			    			graphics.beginFill(0x0);
			    			graphics.drawRect(x*10,y*10,10,10);
			    			graphics.endFill();
			    			break;
			    		case mapType.test2:
			    			graphics.beginFill(0x00ff00);
			    			graphics.drawRect(x*10,y*10,10,10);
			    			graphics.endFill();
			    			break;
					}
				}
			}
			self.addChild(graphics);
		}
	}

	this.update = function(){
		// //计时器动画
		// this.timeBar.changeLength();
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

	this.drawMap = function(x,y,color){		
		var bgColor = new PIXI.Graphics();
		bgColor.x = x;
		bgColor.y = y;
		bgColor.beginFill(color);
		bgColor.drawRect(0,0,10,10);
		bgColor.endFill();
		this.addChild(bgColor);
	}

}

startScene.prototype = Object.create(PIXI.Container.prototype);