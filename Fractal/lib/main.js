(function(){

	var root = this;

	var Aya = Aya || {};

	Aya.stage = new PIXI.Stage(0xFFFFFF,true);

	Aya.renderer = PIXI.autoDetectRenderer(800,480);

	Aya.init = function(){
		//hello Aya
		root.Aya.helloAya();
		//插入画布
		document.body.appendChild(Aya.renderer.view);
		//加载资源
		Aya.loadResource();
	}

	Aya.loadResource = function(){
		var loader = new PIXI.AssetLoader($file);
		loader.onComplete = function(){
			console.log('OK');
			Aya.main();
			console.log(this.loadCount);
		};
		loader.onProgress = function(event){
			console.log($file.length-this.loadCount+' / '+$file.length);
		}
		loader.load();
	}

	Aya.helloAya = function(){
		console.log('This is Aya!');
	}

	Aya.main = function(){
		//获取舞台
		var stage = Aya.stage;
		var viewWidth = Aya.renderer.width;
		var viewHeight = Aya.renderer.height;
		var rectEdge = 50;
		//获取绘图对象
		var sprite = PIXI.Sprite.fromImage($file[0]);
		sprite.width = 50;
		sprite.height = 50;
		sprite.x = viewWidth/2 - 25;
		sprite.y = 400;
		stage.addChild(sprite);
		Aya.createRect(rectEdge,sprite,stage,4);
		//进入循环
		Aya.update();
	}

	Aya.createRect = function(edge,parent,stage,num){
		if (num <= 0) {return;}
		var newEdge = Math.cos(Math.PI/4)*edge;
		//创建第一个子矩形
		var rect1 = new PIXI.Sprite.fromImage($file[0])
		rect1.width = newEdge;
		rect1.height = newEdge;
		rect1.x = -edge/2;
		rect1.y = -edge/2;
		rect1.rotation = -Math.PI/4;
		rect1.interaction = true;
		rect1.buttonMode = true;
		parent.addChild(rect1);
		//创建第二个子矩形
		var rect2 = new PIXI.Sprite.fromImage($file[0]);
		rect2.width = newEdge;
		rect2.height = newEdge;
		rect2.x = edge;
		rect2.y = -edge;
		rect2.rotation = Math.PI/4;
		parent.addChild(rect2);
		Aya.createRect(newEdge,rect1,stage,num-1);
		Aya.createRect(newEdge,rect2,stage,num-1);
	}

	Aya.update = function(){
		//主循环
		requestAnimFrame(Aya.update);
		//开始渲染
		Aya.renderer.render(Aya.stage);
	}

	root.Aya = Aya;

}).call(this);