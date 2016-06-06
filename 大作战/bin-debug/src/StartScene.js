/**
 * Created by Administrator on 2015/4/20.
 */
var StartScene = (function (_super) {
    __extends(StartScene, _super);
    function StartScene() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = StartScene.prototype;
    //添加进舞台
    __egretProto__.onAddToStage = function () {
        //创建开始UI
        this.createStartUI();
    };
    //创建开始界面
    __egretProto__.createStartUI = function () {
        //背景
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes('bg');
        this.addChild(bg);
        if (bg.measuredHeight < this.stage.stageHeight) {
            bg.width *= this.stage.stageHeight / bg.measuredHeight;
            bg.height = this.stage.stageHeight;
        }
        //标题
        var title = new egret.Bitmap();
        title.texture = RES.getRes('title');
        title.anchorX = 0.5;
        title.anchorY = 0.5;
        title.x = this.stage.stageWidth / 2;
        title.y = this.stage.stageHeight / 2 - 180;
        title.scaleX = 0;
        title.scaleY = 0;
        this.addChild(title);
        //logo
        var logo = new egret.Bitmap();
        logo.texture = RES.getRes('logo');
        logo.x = this.stage.stageWidth;
        logo.y = this.stage.stageHeight - 80;
        logo.touchEnabled = true;
        logo.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            top.window.location.href = 'http://doupu.cn';
        }, this);
        this.addChild(logo);
        egret.Tween.get(title).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut).call(function () {
            egret.Tween.get(logo).to({ x: this.stage.stageWidth - 250 }, 500, egret.Ease.backOut);
        });
        //开始按钮
        var startBtnSprite = new egret.Sprite();
        startBtnSprite.anchorX = 0.5;
        startBtnSprite.anchorY = 0.5;
        startBtnSprite.alpha = 0;
        startBtnSprite.x = this.stage.stageWidth / 2;
        startBtnSprite.y = this.stage.stageHeight / 2 + 200;
        //开始按钮事件绑定
        startBtnSprite.touchEnabled = true;
        startBtnSprite.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            startBtnSprite.scaleX = 0.9;
            startBtnSprite.scaleY = 0.9;
        }, this);
        startBtnSprite.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            startBtnSprite.scaleX = 1;
            startBtnSprite.scaleY = 1;
        }, this);
        startBtnSprite.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            startBtnSprite.scaleX = 1;
            startBtnSprite.scaleY = 1;
        }, this);
        var self = this;
        startBtnSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            self.stage.addChild(new LevelScene());
            self.stage.removeChild(self);
        }, this);
        this.addChild(startBtnSprite);
        var startBtn = new egret.Shape();
        startBtn.graphics.lineStyle(2, 0x000000, 1);
        startBtn.graphics.beginFill(0xFFFFFF, 1);
        startBtn.graphics.drawRoundRect(0, 0, 200, 80, 50, 50);
        startBtn.graphics.endFill();
        startBtnSprite.addChild(startBtn);
        var color = 0x0099FF;
        var changeColor = 0x000100;
        this.addEventListener(egret.Event.ENTER_FRAME, function () {
            startBtn.graphics.clear();
            startBtn.graphics.lineStyle(2, 0x000000, 1);
            startBtn.graphics.beginFill(color += changeColor, 1);
            startBtn.graphics.drawRoundRect(0, 0, 200, 80, 50, 50);
            startBtn.graphics.endFill();
            if (color >= 0x00CEFF) {
                changeColor = -0x000100;
            }
            if (color <= 0x0099FF) {
                changeColor = 0x000100;
            }
        }, this);
        //开始按钮文字
        var startBtnText = new egret.TextField();
        startBtnText.anchorX = 0.5;
        startBtnText.anchorY = 0.5;
        startBtnText.x = startBtn.width / 2;
        startBtnText.y = startBtn.height / 2;
        startBtnText.text = "开 始";
        startBtnText.textColor = 0x000000;
        startBtnSprite.addChild(startBtnText);
        egret.Tween.get(startBtnSprite).to({ alpha: 1 }, 500, egret.Ease.sineIn);
    };
    //创建
    __egretProto__.createBitmap = function (name) {
        var Bitmap = new egret.Bitmap();
        Bitmap.texture = RES.getRes(name);
        this.addChild(Bitmap);
    };
    return StartScene;
})(egret.DisplayObjectContainer);
StartScene.prototype.__class__ = "StartScene";
