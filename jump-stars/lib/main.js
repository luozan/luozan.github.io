(function(){
	//获取全局对象
	var Root = this;
	var Game = Game||{};
	//性能监控
	Game.stats = null;
	//舞台尺寸
	Game.viewWidth = window.innerWidth;
	Game.viewHeight = window.innerHeight;
	//舞台颜色
	Game.backgroundColor = 0xFFFFFF;
	//舞台
	Game.stage = null;
	//渲染器
	Game.renderer = null;
	//canvas
	Game.canvas = null;
	//场景管理器
	Game.sceneManager = null;
	//JSON管理器
	Game.jsonManager = [];
	//编辑器组件容器
	// Game.modules = [];
	Game.world = null;
	Game.physics = null;
	//运行
	Game.run = function(width,height,color){
		Game.viewWidth = width || 1200;
		Game.viewHeight = height || window.innerHeight;
		Game.backgroundColor = color || 0x000000;
		var loader = new Game.Loader($Config.file);
		loader.load();
	}

	Game.init = function(){
		//创建舞台
		Game.stage = new PIXI.Container();
		//创建渲染器
		Game.renderer = new PIXI.WebGLRenderer(Game.viewWidth,Game.viewHeight);
		Game.canvas = Game.renderer.view;
		// Game.renderer.context.webkitImageSmoothingEnabled = false;
		// Game.renderer.context.imageSmoothingEnabled = false;
		//插入渲染器
		document.body.appendChild(Game.canvas);
		//创建性能监控面板
		Game.stats = new Stats();
		Game.stats.setMode(0); // 0: fps, 1: ms, 2: mb
		document.body.appendChild(Game.stats.domElement);
		//创建性能面板dom
		Game.stats.domElement.style.position = 'absolute';
		Game.stats.domElement.style.left = '0px';
		Game.stats.domElement.style.top = '0px';
		//创建编辑器组件
		// var moduleConfig = $Config['lib']['modules'];
		// for(var key in moduleConfig){
		// 	this.modules[key] = new window[key]();
		// }
		//时钟对象
		Game.time = new Game.Time();
		Game.time.init();
		//物理引擎
		Game.world = new Game.World();
		Game.physics = new Game.Physics(Game.world);
		//创建场景管理器
		Game.sceneManager = new Game.SceneManager();
		Game.sceneManager.stage = Game.stage;
		Game.sceneManager.loadScene($Config.startScene);
		this.__loop();
	}

	// Game.getModule = function(string){
	// 	return this.modules[string];
	// }

	Game.loadResource = function(){
		var resource = $Config['resource'];
		var loader = PIXI.loader;
		for(var key in resource){
			loader.add(key,resource[key],function(res){
				if(res.isJson){
					Game.jsonManager[res.name] = res.data;
				}
				if(res.tiledMap){
					Game.map = res.tiledMap;
				}
			});
		}
		loader.once('complete',function(){
			Game.init();
		});
		loader.on('progress',function(e){
			console.log("资源加载中："+e.progress+"%");
		});
		loader.load();
	}

	Game.__loop = function(){
		requestAnimationFrame(Game.__loop);
		//性能检测开始
		Game.stats.begin();

		Game.time.updateLastTime();

		Game.world.update(Game.time.fixedDeltaTime);

		Game.sceneManager.currentScene.update();
		Game.renderer.render(Game.stage);
		
		Game.time.updateDeltaTime();
		//性能检测结束
		Game.stats.end();
	}

	Game.Loader = function(config){
		//加载完成的文件数
		this.loaded = 0;
		//总的文件数
		this.total = 0;
		//配置对象
		this.list = config||{};
	}

	Game.Loader.prototype.load = function(){
		//初始化
		this.loaded = 0;
		//获取总数
		for(var key in this.list){
			this.total++;
		}
		//开始加载
		for(var key in this.list){
			var script = document.createElement('script');
			script.src = this.list[key];
			script.onload = function(key){
				this.loaded++;
				console.log('已加载文件<'+key+'> '+this.loaded+'/'+this.total);
				if(this.loaded == this.total){
					Game.loadResource();
				}
			}.bind(this,key);
			document.head.appendChild(script);
		}
	}

	Game.Loader.prototype.constructor = Game.Loader;

	Game.Math = function(){

	}

	Game.Math.clamp = function(value,min,max){
		if (value < min) {
			return min;
		}
		else if(value > max){
			return max;
		}
		else{
			return value;
		}
	}

	Game.Math.prototype.constructor = Game.Math;

	Game.SceneManager = function(){
		this.currentScene = null;
		this.stage = null;
	}

	Game.SceneManager.prototype.loadScene = function(scene){
		this.stage.removeChildren();
		this.currentScene = new window[scene]();
		this.currentScene.init();
		console.log(scene+'场景已添加到舞台！');		
	}

	Game.SceneManager.prototype.constructor = Game.SceneManager;

	Game.Time = function(){
		this.deltaTime = 0;
		this.beginTime = 0;
		this.lastTime = 0;
		this.dateObject = null;
		this.fixedDeltaTime = 0.002;
	}

	Game.Time.prototype.init = function(){
		this.dateObject = new Date();
		this.beginTime = this.dateObject.getTime();
	}

	Game.Time.prototype.updateDeltaTime = function(){
		var currentTime = new Date().getTime();
		this.deltaTime = (currentTime - this.lastTime)/1000;
	}
	Game.Time.prototype.updateLastTime = function(){
		this.lastTime = new Date().getTime();
	}

	Root.Game = Game;
}).call(this);