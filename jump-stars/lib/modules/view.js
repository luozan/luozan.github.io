//编辑区
function view(){
	this.backgroundColor = 0xFFFFFF;
	this.x = this.y = 0;
	this.width = 0;
	this.height = 0;
	this.init = function(){
		var workspace = Edword.getModule('workspace');
		//获取宽高
		this.width = Edword.viewWidth - workspace.width;
		this.height = Edword.viewHeight;
		//创建view
		var view = new PIXI.Graphics();
		view.width = this.width;
		view.height = this.height;
		Edword.stage.addChild(view);
		//创建背景色
		view.beginFill(this.backgroundColor);
		view.drawRect(this.x,this.y,this.width,this.height);
		view.endFill();

		//创建拖拽提示
		var dropTip = this.createSprite("tip_drop_png",0.5,0.5,this.width/2,this.height/2);
		view.addChild(dropTip);
		Edword.canvas.addEventListener("dragenter", function(e){  
		    e.stopPropagation();  
		    e.preventDefault();  
		}, false);  
		Edword.canvas.addEventListener("dragover", function(e){  
		    e.stopPropagation();  
		    e.preventDefault();  
		}, false);  
		Edword.canvas.addEventListener("drop", function(e){
			e.stopPropagation();  
		    e.preventDefault();  
			var img = document.createElement('image');
			img.file = e.dataTransfer.files[0];  
			var fileReader = new FileReader();
			fileReader.onload = function(e){
				console.log(e.target.result);
				var texture = PIXI.Texture.fromImage(e.target.result);
				var sprite = new PIXI.Sprite(texture);
				sprite.anchor.x = 0.5;
				sprite.anchor.y = 0.5;
				sprite.x = view.width/2;
				sprite.y = view.height/2;
				view.addChild(sprite);
				dropTip.parent.removeChild(dropTip);
			};
			fileReader.readAsDataURL(e.dataTransfer.files[0]);
		}, false); 
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

	this.init();
}