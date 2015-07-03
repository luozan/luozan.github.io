(function(){
	// 根指针
	var root = this;
	//设置Aya对象
	var Aya = Aya || {};
	//舞台宽度
	Aya.stageWidth = 640;
	//舞台高度
	Aya.stageHeight = 960;
	//当前场景
	Aya.scene = null;
	//创建舞台
	Aya.stage = new PIXI.Stage(0xFFFFFF,true);
	//创建渲染器
	Aya.renderer = PIXI.autoDetectRenderer(Aya.stageWidth,Aya.stageHeight);
	//动画列表
	Aya.animationList = [];
	//毫秒每帧
	Aya.MPF = 1000/60;
	//初始化函数
	Aya.init = function(){
		//hello Aya
		Aya.helloAya();
		//插入画布
		document.body.appendChild(Aya.renderer.view);
		//加载资源
		Aya.loadResource($resource);
	}
	//资源加载
	Aya.loadResource = function(assets){
		var loader = new PIXI.AssetLoader(assets);
		loader.onComplete = function(){
			console.log('资源加载完成！');
			Aya.main();
		};
		loader.onProgress = function(){
			console.log(assets.length-this.loadCount+' / '+assets.length);
		}
		loader.load();
	}
	//清空舞台
	Aya.clearStage = function(){
		Aya.stage.removeChildren();
	}
	//切换场景
	Aya.nextScene = function(scene){
		Aya.scene = scene;
	}
	//hello Aya
	Aya.helloAya = function(){
		console.log('This is Aya!');
	}
	//动画对象
	Aya.animation = function(obj){
		this.obj = obj;
		this.actionList = [];
		this.currentAnimation = null;
		this.valueObj = [];
		this.isLoop = false;
		this.endList = [];
	}
	Aya.animation.prototype.to = function(valueObj,time){
		var action = new Aya.action(this.obj);
		action.runNum = action.num = time/Aya.MPF;
		//计算改变值
		for(var key in valueObj){
			if(this.valueObj[key] != undefined){
				action.change[key] = (valueObj[key]-this.valueObj[key])/action.runNum;
			}
			else{
				action.change[key] = (valueObj[key]-this.obj[key])/action.runNum;
			}
		}
		this.valueObj = valueObj;
		if (!this.currentAnimation) {
			this.currentAnimation = action;
		}
		else{
			this.actionList.push(action);
		}
		return this;
	}
	Aya.animation.prototype.by = function(valueObj,time){
		var action = new Aya.action(this.obj);
		action.runNum = action.num = time/Aya.MPF;
		//计算改变值
		for(var key in valueObj){
			action.change[key] = valueObj[key]/action.runNum;
			this.valueObj[key] = valueObj[key]+this.obj[key];
		}
		if (!this.currentAnimation) {
			this.currentAnimation = action;
		}
		else{
			this.actionList.push(action);
		}
		return this;
	}
	Aya.animation.prototype.wait = function(time){
		var action = new Aya.action({});
		action.runNum = action.num = time/Aya.MPF;
		if (!this.currentAnimation) {
			this.currentAnimation = action;
		}
		else{
			this.actionList.push(action);
		}
		return this;
	}
	Aya.animation.prototype.callback = function(callback){
		var action = new Aya.callback(callback);
		if (!this.currentAnimation) {
			this.currentAnimation = action;
		}
		else{
			this.actionList.push(action);
		}
		return this;
	}
	Aya.animation.prototype.action = function(){
		this.currentAnimation.run();
		if (this.currentAnimation.state == 'stop') {
			if (this.isLoop) {
				this.currentAnimation.state = 'running';
				if (this.currentAnimation.num) {
					this.currentAnimation.runNum = this.currentAnimation.num;
				}
				if (this.currentAnimation.callback) {
					this.currentAnimation.state = 'stop';
				};
				this.actionList.push(this.currentAnimation);
				this.currentAnimation = this.actionList.shift();
			}
			else{
				this.currentAnimation = this.actionList.shift();
			}
		}

	}
	Aya.animation.prototype.constructor = Aya.animation;
	//回调对象
	Aya.callback = function(callback){
		this.callback = callback;
		this.state = 'stop';
	}
	Aya.callback.prototype.run = function(){
		this.callback();
	}
	Aya.callback.prototype.constructor = Aya.callback;
	//动作对象
	Aya.action = function(obj){
		//动作对象
		this.obj = obj;
		//改变值列表
		this.change = {};
		//执行次数
		this.runNum = 0;
		//次数
		this.num = 0;
		//目标值
		this.valueObj = null;
		//状态值
		this.state = 'running';
	}
	Aya.action.prototype.run = function(){
		if (this.runNum <= 0) {
			this.state = 'stop';
			return;
		}
		for(var key in this.change){
			if (this.change[key] == 0 || isNaN(this.change[key])) {
				continue;
			}
			this.obj[key] += this.change[key];
		}

		this.runNum--;
	}
	Aya.action.prototype.constructor = Aya.action;
	//创建动画
	Aya.createAnimation = function(obj,isLoop){
		var animation = new Aya.animation(obj);
		if (isLoop) {
			animation.isLoop = isLoop;
		}
		Aya.animationList.push(animation);
		return animation;
	};
	//飘浮提示信息
	Aya.message = function(text){
		var message = new PIXI.Text(text,{
			font:'35px 微软雅黑',
			fill:'green'
		});
		message.anchor.x = 0.5;
		message.anchor.y = 0.5;
		message.x = Aya.stageWidth/2;
		message.y = Aya.stageHeight/2;
		Aya.stage.addChild(message);
		Aya.createAnimation(message).wait(300).by({y:-100,alpha:-0.5},500).callback(function(){
			Aya.stage.removeChild(message);
		});
	}
	//格式化数字
	Aya.formatNumber = function(number){
		number = Math.floor(number);
		if (number >= 1000) {
			var str = number.toString();
			var arr = str.split("");
			for (var i = arr.length-1,s = 1;i >= 0;i--,s++) {
				if (s%3 == 0) {
					arr.splice(i,0,',');
				}
			}
			return arr.join("");
		}
		else{
			return number;
		}
	}
	//主入口
	Aya.main = function(){
		Aya.nextScene(new startScene());
		//进入循环
		Aya.loop();
	}
	Aya.loop = function(){
		//主循环
		requestAnimFrame(Aya.loop);
		//动画
		for(var i = 0;i < Aya.animationList.length;i++){
			if (Aya.animationList[i].actionList.length == 0 && !Aya.animationList[i].currentAnimation) {
				Aya.animationList.splice(i,1);
				continue;
			}
			Aya.animationList[i].action();
		}
		//场景更新
		Aya.scene.update();
		//开始渲染
		Aya.renderer.render(Aya.stage);
	}

	root.Aya = Aya;

}).call(this);