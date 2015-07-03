//开始界面场景
function startScene(){

	this.update = function(){

	}

	this.__init = function(){
		var startBtn = this.createSprite('resource/start_btn.png');
		startBtn.anchor.x = 0.5;
		startBtn.anchor.y = 0.5;
		startBtn.x = Aya.stageWidth/2;
		startBtn.y = Aya.stageHeight/2;
		startBtn.buttonMode = true;
		startBtn.interactive = true
		startBtn.isDown = false;
		startBtn.mousedown = startBtn.touchstart = function(){
			if (startBtn.isDown) {return;};
			startBtn.scale.x = 0.8;
			startBtn.scale.y = 0.8;
		}
		startBtn.mouseup = startBtn.touchend = function(){
			startBtn.scale.x = 1;
			startBtn.scale.y = 1;
			startBtn.isDown = false;
		}
		startBtn.mouseupoutside = startBtn.touchendoutside = function(){
			startBtn.isDown = false;
			startBtn.scale.x = 1;
			startBtn.scale.y = 1;
		}
		startBtn.click = startBtn.tap = function(){
			Aya.clearStage();
			Aya.nextScene(new gameScene());
		}
		Aya.stage.addChild(startBtn);
		console.log('开始画面');
	}

	this.createSprite = function(url){
		var sprite = PIXI.Sprite.fromImage(url);
		return sprite;
	}
	this.__init();
}