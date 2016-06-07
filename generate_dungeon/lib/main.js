(function(){
	//获取全局对象
	var Root = this;
	var Game = Game||{};
	//调试模式
	Game.isDebug = true;
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
	//网络模块
	Game.net = null;
	//适配回调函数
	Game.resizeEventCallback = null;
	//编辑器组件容器
	// Game.modules = [];
	// Game.world = null;
	// Game.physics = null;
	//运行
	Game.run = function(width,height,color,isDebug){
		console.clear()

		Game.isDebug = isDebug || true;
		Game.viewWidth = width || 1200;
		Game.viewHeight = height || window.innerHeight;
		Game.backgroundColor = color || 0x0;
		var loader = new Game.Loader($Config.file);
		loader.load();
	}

	Game.init = function(){
		//创建舞台
		Game.stage = new PIXI.Container();
		//创建渲染器
		// Game.renderer = new PIXI.WebGLRenderer(Game.viewWidth,Game.viewHeight,{'backgroundColor':Game.backgroundColor},true);
		Game.renderer = PIXI.autoDetectRenderer(Game.viewWidth,Game.viewHeight,{'backgroundColor':Game.backgroundColor});
		Game.canvas = Game.renderer.view;
		Game.canvas.id = 'GameCanvas'
		Game.canvas.style.width = Game.viewWidth+'px';
		Game.canvas.style.height = Game.viewHeight+'px';
		// Game.canvas.style.opacity = '0';
		// Game.renderer.context.webkitImageSmoothingEnabled = false;
		// Game.renderer.context.imageSmoothingEnabled = false;
		//插入渲染器
		// var UI = document.getElementById('UI');
		document.body.appendChild(Game.canvas);
		//获取DOM元素UI
		// var ui = document.getElementById('UI');
		// ui.style.width = Game.canvas.offsetWidth+'px';
		// ui.style.height = Game.canvas.offsetHeight+'px';
		// Game.canvas.style.marginLeft = '-'+Game.canvas.offsetWidth/2+'px';
		// Game.canvas.style.marginTop = '-'+Game.canvas.offsetHeight/2+'px';
		// UI.style.height = Game.canvas.offsetHeight+'px';
		// window.onresize = function(){
		// 	Game.canvas.style.marginLeft = '-'+Game.canvas.offsetWidth/2+'px';
		// 	Game.canvas.style.marginTop = '-'+Game.canvas.offsetHeight/2+'px';
		// 	UI.style.height = Game.canvas.offsetHeight+'px';
		// 	if(Game.resizeEventCallback){
		// 		Game.resizeEventCallback();
		// 	}
		// 	// ui.style.width = Game.canvas.offsetWidth+'px';
		// 	// ui.style.height = Game.canvas.offsetHeight+'px';
		// }
		//创建性能监控面板
		Game.stats = new Stats();
		Game.stats.setMode(0); // 0: fps, 1: ms, 2: mb
		document.body.appendChild(Game.stats.domElement);
		//创建性能面板dom
		Game.stats.domElement.style.position = 'absolute';
		Game.stats.domElement.style.left = '0px';
		Game.stats.domElement.style.top = '0px';
		Game.stats.domElement.style.zIndex = '9999';
		if(!Game.isDebug){
			Game.stats.domElement.style.display = 'none';
		}
		//创建编辑器组件
		// var moduleConfig = $Config['lib']['modules'];
		// for(var key in moduleConfig){
		// 	this.modules[key] = new window[key]();
		// }
		//时钟对象
		Game.time = new Game.Time();
		Game.time.init();
		//物理引擎
		// Game.world = new Game.World();
		// Game.physics = new Game.Physics(Game.world);
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
		if(Game.Util.isNullObject(resource)){
			console.log('资源加载完成');
			Game.init();
			return;
		}
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
			console.log('资源加载完成');
			Game.init();
		});
		loader.on('progress',function(e){
			maxWidth = e.progress.toFixed(2)*1216/100;
			console.log("资源加载中："+e.progress+"%");
		});
		loader.load();
	}

	Game.__loop = function(){
		requestAnimationFrame(Game.__loop);
		//性能检测开始
		Game.stats.begin();

		Game.time.updateLastTime();

		// Game.world.update(Game.time.fixedDeltaTime);
		// TWEEN.update();
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
					// //是否支持websocket
					// if(!window.WebSocket){
					// 	var html = '<div style="width:600px;height:30px;position:absolute;left:50%;margin-left:-300px;top:50%;margin-top:-15px;text-align:center;">您的浏览器不支持‘WebSocket’,建议使用最新版本的Chrome浏览器。T^T </div>';
					// 	document.body.innerHTML = html;
					// 	return;
					// }
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

	Game.SceneManager.prototype.loadScene = function(scene,arg){
		this.stage.removeChildren();
		if(arg){
			this.currentScene = new window[scene](arg);
		}else{
			this.currentScene = new window[scene]();
		}
		this.currentScene.init();
		this.stage.addChild(this.currentScene);
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
	//数字表
	Game.NUMBER_TABLE = ['零','一','二','三','四','五','六','七','八','九'];
	Game.Util = {
		isNullObject:function(obj){
			for(var key in obj){
				if(obj.hasOwnProperty(key)){
					return false;
				}
			}
			return true;
		},
		numberToChinese:function(number){
			var length = number.toString().length;
		}
	}

	Root.Game = Game;
}).call(this);