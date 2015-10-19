//工作区域
function workspace(){
	this.baseColor = 0xF1F1F1;
	this.width = 0;
	this.height = 0;
	this.x = 0;
	this.y = 0;
	this.MIN_WIDTH = 350;
	this.init = function(){
		//工作区宽度
		this.width = Edword.viewWidth*0.3;
		this.height = Edword.viewHeight;
		//宽度限制
		if(this.width < this.MIN_WIDTH){
			this.width = this.MIN_WIDTH;
		}

		//工作区坐标
		this.x = Edword.viewWidth-this.width;
		this.y = 0;

		//创建工作区
		var workspace = new PIXI.Container();

		//创建左边线
		var borderLeft = new PIXI.Graphics();
		borderLeft.lineStyle(1,this.baseColor);
		borderLeft.moveTo(Edword.viewWidth-this.width,0);
		borderLeft.lineTo(Edword.viewWidth-this.width,Edword.viewHeight);
		workspace.addChild(borderLeft);

		//创建背景
		borderLeft.beginFill(this.baseColor);
		borderLeft.drawRect(this.x,this.y,this.width,this.height);
		borderLeft.endFill();
		//创建列表框
		borderLeft.beginFill(0xBBBBBB);
		borderLeft.drawRoundedRect(this.x+20,this.y+20,this.width-40,400);
		borderLeft.endFill();

		Edword.stage.addChild(workspace);
	}

	this.update = function(){

	}

	this.init();
}