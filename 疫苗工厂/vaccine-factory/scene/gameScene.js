//游戏场景
function gameScene(){
	/* 属性 */
	//钱
	this.money = 0;
	//药
	this.vaccine = 0;
	//药物自动制造
	this.autoMakeVaccineList = [];
	//疫苗文字对象
	this.vaccineText = null;
	//钱文字对象
	this.moneyText = null;
	//白天
	this.day = null;
	//夜晚
	this.night = null;
	var self = this;
	this.people = function(){
		this.number = 0;
		this.MAX = 0;
		this.price = 0;
		this.value = 0;
		this.name = "";
	}
	this.update = function(){
		for (var key in self.autoMakeVaccineList) {
			self.vaccine += self.autoMakeVaccineList[key].number*self.autoMakeVaccineList[key].value/60;
		};

		self.vaccineText.setText(Aya.formatNumber(self.vaccine)+' 支');
	}

	this.__init = function(){
		//明面按钮
		// var tabWhite = this.createSprite('resource/tab_white.png');
		// tabWhite.x = Aya.stageWidth-60;
		// tabWhite.y = 200;
		// tabWhite.buttonMode = true;
		// tabWhite.interactive = true;
		// tabWhite.click = tabWhite.tap = function(){
		// 	Aya.stage.setBackgroundColor(0xFFFFFF);
		// }
		var sun = this.createSprite('resource/sun.png');
		sun.anchor.x = 1;
		sun.x = Aya.stageWidth;
		sun.y = 0;
		sun.buttonMode = true;
		sun.interactive = true;
		sun.visible = false;
		sun.click = sun.tap = function(){
			Aya.stage.setBackgroundColor(0xFFFFFF);
			sun.visible = false;
			moon.visible = true;
			self.day.visible = true;
		}
		Aya.stage.addChild(sun);
		//暗面按钮
		// Aya.stage.addChild(tabWhite);
		// var tabBlack = this.createSprite('resource/tab_black.png');
		// tabBlack.x = Aya.stageWidth-60;
		// tabBlack.y = 100;
		// tabBlack.buttonMode = true;
		// tabBlack.interactive = true;
		// tabBlack.click  = tabBlack.tap = function(){
		// 	Aya.stage.setBackgroundColor(0x000000);
		// }
		// Aya.stage.addChild(tabBlack);
		var moon = this.createSprite('resource/moon.png');
		moon.anchor.x = 1;
		moon.x = Aya.stageWidth;
		moon.y = 0;
		moon.buttonMode = true;
		moon.interactive = true;
		moon.click = moon.tap = function(){
			Aya.stage.setBackgroundColor(0x000000);
			sun.visible = true;
			moon.visible = false;
			self.day.visible = false;
		}
		Aya.stage.addChild(moon);

		this.createDay();
		this.createNight();
	}

	this.createDay = function(){
		var day = new PIXI.Sprite();
		this.day = day;
		Aya.stage.addChild(day);
		//工作台
		var table = this.createSprite('resource/table.png');
		table.anchor.x = 0.5;
		table.anchor.y = 0.5;
		table.x = Aya.stageWidth/2;
		table.y = 200;
		table.buttonMode = true;
		table.interactive = true;
		table.mousedown = table.touchstart = function(){
			table.scale.x = 0.8;
			table.scale.y = 0.8;
		}
		table.mouseup = table.touchend = function(){
			table.scale.x = 1;
			table.scale.y = 1;
		}
		table.mouseupoutside = table.touchendoutside = function(){
			table.scale.x = 1;
			table.scale.y = 1;
		}
		table.click = table.tap = function(){
			self.vaccine++;
			self.vaccineText.setText(Aya.formatNumber(self.vaccine)+' 支');
		}
		day.addChild(table);
		//制药按钮
		var yaoBtn = this.createSprite('resource/yao_btn.png');
		yaoBtn.anchor.x = 0.5;
		yaoBtn.anchor.y = 0.5;
		yaoBtn.x = 54;
		yaoBtn.y = Aya.stageHeight-200;
		yaoBtn.buttonMode = true;
		yaoBtn.interactive = true;
		yaoBtn.mousedown = yaoBtn.touchstart =function(){
			yaoBtn.scale.x = 0.8;
			yaoBtn.scale.y = 0.8
		}
		yaoBtn.mouseup = yaoBtn.touchend = function(){
			yaoBtn.scale.x = 1;
			yaoBtn.scale.y = 1;
		}
		yaoBtn.mouseupoutside = yaoBtn.touchendoutside = function(){
			yaoBtn.scale.x = 1;
			yaoBtn.scale.y = 1;
		}
		yaoBtn.click = yaoBtn.tap = function(){
			self.vaccine++;
			self.vaccineText.setText(Aya.formatNumber(self.vaccine)+' 支');
		}
		day.addChild(yaoBtn);

		//换钱按钮
		var sellBtn = this.createSprite('resource/sell_btn.png');
		sellBtn.anchor.x = 0.5;
		sellBtn.anchor.y = 0.5;
		sellBtn.x = 54;
		sellBtn.y = Aya.stageHeight-120;
		sellBtn.buttonMode = true;
		sellBtn.interactive = true;
		sellBtn.mousedown = sellBtn.touchstart = function(){
			sellBtn.scale.x = 0.8;
			sellBtn.scale.y = 0.8;
		}
		sellBtn.mouseup = sellBtn.touchend = function(){
			sellBtn.scale.x = 1;
			sellBtn.scale.y = 1;
		}
		sellBtn.mouseupoutside = sellBtn.touchendoutside = function(){
			sellBtn.scale.x = 1;
			sellBtn.scale.y = 1;
		}
		sellBtn.click = sellBtn.tap = function(){
			if (self.vaccine < 1) {
				Aya.message('没有疫苗可以出售了，赶紧生产吧！');
				return;
			};
			self.money += 20;
			self.vaccine--;
			self.vaccineText.setText(Aya.formatNumber(self.vaccine)+' 支');
			self.moneyText.setText('¥ '+Aya.formatNumber(self.money));
		}
		day.addChild(sellBtn);

		//疫苗数量
		var vaccine = new PIXI.Text('0 支',
			{
				font:'28px 微软雅黑',
				fill:'green'
			}
		);
		vaccine.x = 120;
		vaccine.anchor.y = 0.5;
		vaccine.y = Aya.stageHeight-190;
		this.vaccineText = vaccine;
		day.addChild(vaccine);

		//钱
		var money = new PIXI.Text('¥ 0',
			{
				font:'28px 微软雅黑',
				fill:'red'

			}
		);
		money.x = 120;
		money.anchor.y = 0.5;
		money.y = Aya.stageHeight-110;
		this.moneyText = money;
		day.addChild(money);

		//场景列表
		var scene1 = this.createSprite('resource/bg.png');
		scene1.y = 300;
		day.addChild(scene1);
		var p = new this.people();
		p.MAX = 1000;
		p.price = 1000;
		p.value = 1;
		p.name = '制药工人';
		this.autoMakeVaccineList['worker'] = p;
		var nameAndValue = new PIXI.Text(p.name+'   ¥'+p.price,{
			font:'20px 微软雅黑',
			fill:'black'
		});
		nameAndValue.anchor.y = 1;
		nameAndValue.x = 20;
		nameAndValue.y = -5;
		scene1.addChild(nameAndValue);
		var number = new PIXI.Text('目前人数   '+p.number+'/'+p.MAX,{
			font:'20px 微软雅黑',
			fill:'black'
		});
		number.anchor.y = 1;
		number.x = 20+nameAndValue.width+20;
		number.y = -5;
		scene1.addChild(number);
		var addBtn = this.createSprite('resource/add_btn.png');
		addBtn.anchor.y = 0.5;
		addBtn.x = 20;
		addBtn.y = 50;
		addBtn.buttonMode = true;
		addBtn.interactive = true;
		addBtn.click = addBtn.tap = function(){
			if (self.money < 1000) {
				Aya.message('这么点儿钱也想请工人？赶紧赚钱吧！');
				return;
			}
			self.money -= 1000;
			self.moneyText.setText('¥ '+self.money);
			var item = self.autoMakeVaccineList['worker'];
			item.number++;
			number.setText('目前人数   '+item.number+'/'+item.MAX);
			if(item.number >= 20){
				return;
			}
			var people = self.createSprite('resource/people.png');
			people.x = Math.random()*500+50;
			people.y = 24.5;
			people.isSmile = false;
			scene1.addChild(people);
			Aya.createAnimation(people,true).by({x:30},500).callback(function(){
				if (!people.isSmile) {
					people.texture = PIXI.Texture.fromImage('resource/people_smile.png');
					people.isSmile = true;
				}
				else{
					people.texture = PIXI.Texture.fromImage('resource/people.png');
					people.isSmile = false;
				}
			}).by({x:-30},500);
		}
		scene1.addChild(addBtn);
	}

	this.createNight = function(){
		var night = new PIXI.Sprite();
		night.visible = false;
		Aya.stage.addChild(night);
	}

	this.createSprite = function(url){
		var sprite = PIXI.Sprite.fromImage(url);
		return sprite;
	}

	this.__init();
}