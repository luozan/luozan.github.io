/**
 * Created by Administrator on 2015/5/5.
 */
var PauseScene = (function (_super) {
    __extends(PauseScene, _super);
    function PauseScene() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = PauseScene.prototype;
    __egretProto__.onAddToStage = function () {
        this.createSprite();
    };
    __egretProto__.createSprite = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var width = 0.7 * stageW;
        //this.y = -stageH;
        this.alpha = 0;
        //标题
        var title = new egret.TextField();
        title.text = 'YOU WIN!';
        title.textColor = 0xFF6A6A;
        title.size = 50;
        title.bold = true;
        title.anchorX = 0.5;
        title.anchorY = 0.5;
        title.x = stageW / 2;
        title.y = stageH / 2 - 300;
        this.addChild(title);
        //分数
        var frame = new egret.Shape();
        frame.anchorX = 0.5;
        frame.anchorY = 0.5;
        frame.x = title.x;
        frame.y = stageH / 2 - 120;
        frame.graphics.beginFill(0x00CEFF, 1);
        frame.graphics.drawRoundRect(0, 0, width, 200, 20, 20);
        frame.graphics.endFill();
        this.addChild(frame);
        var timeTitle = new egret.TextField();
        timeTitle.text = 'TIME';
        timeTitle.textColor = 0xFFFFFF;
        timeTitle.size = 30;
        timeTitle.bold = true;
        timeTitle.anchorX = 0.5;
        timeTitle.anchorY = 0.5;
        timeTitle.x = frame.x;
        timeTitle.y = frame.y - 50;
        this.addChild(timeTitle);
        var time = new egret.TextField();
        time.text = '0:20:10';
        time.textColor = 0xFFFFFF;
        time.size = 50;
        time.bold = true;
        time.anchorX = 0.5;
        time.anchorY = 0.5;
        time.x = frame.x;
        time.y = frame.y + 10;
        this.addChild(time);
        // 下一关按钮
        var nextLevelBtn = new egret.Shape();
        nextLevelBtn.anchorX = 0.5;
        nextLevelBtn.anchorY = 0.5;
        nextLevelBtn.x = time.x;
        nextLevelBtn.y = stageH / 2 + 50;
        nextLevelBtn.graphics.beginFill(0x0099FF, 1);
        nextLevelBtn.graphics.drawRoundRect(0, 0, width, 100, 20, 20);
        nextLevelBtn.graphics.endFill();
        //绑定事件
        nextLevelBtn.touchEnabled = true;
        nextLevelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            nextLevelBtn.touchEnabled = false;
            home.touchEnabled = false;
            egret.Tween.get(nextLevelBtn).to({ scaleX: 0.9, scaleY: 0.9 }, 200, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).call(this.nextLevel, this, [0]);
        }, this);
        this.addChild(nextLevelBtn);
        var nextLevelText = new egret.TextField();
        nextLevelText.text = 'NEXT LEVEL';
        nextLevelText.anchorX = 0.5;
        nextLevelText.anchorY = 0.5;
        nextLevelText.size = 40;
        nextLevelText.textColor = 0xFFFFFF;
        nextLevelText.bold = true;
        nextLevelText.x = nextLevelBtn.x;
        nextLevelText.y = nextLevelBtn.y;
        this.addChild(nextLevelText);
        // 回到主页
        var home = new egret.Shape();
        home.anchorX = 0.5;
        home.anchorY = 0.5;
        home.x = time.x;
        home.y = stageH / 2 + 170;
        home.graphics.beginFill(0x0099FF, 1);
        home.graphics.drawRoundRect(0, 0, width, 100, 20, 20);
        home.graphics.endFill();
        //绑定事件
        home.touchEnabled = true;
        home.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            home.touchEnabled = false;
            nextLevelBtn.touchEnabled = false;
            egret.Tween.get(home).to({ scaleX: 0.9, scaleY: 0.9 }, 200, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).call(this.home, this);
        }, this);
        this.addChild(home);
        var homeText = new egret.TextField();
        homeText.text = 'HOME';
        homeText.anchorX = 0.5;
        homeText.anchorY = 0.5;
        homeText.size = 40;
        homeText.textColor = 0xFFFFFF;
        homeText.bold = true;
        homeText.x = home.x;
        homeText.y = home.y;
        this.addChild(homeText);
        // 分享按钮
        var shareBtn = new egret.Shape();
        shareBtn.anchorX = 0.5;
        shareBtn.anchorY = 0.5;
        shareBtn.x = time.x;
        shareBtn.y = stageH / 2 + 290;
        shareBtn.graphics.beginFill(0x0099FF, 1);
        shareBtn.graphics.drawRoundRect(0, 0, width, 100, 20, 20);
        shareBtn.graphics.endFill();
        //绑定事件
        shareBtn.touchEnabled = true;
        shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            shareBtn.touchEnabled = false;
            egret.Tween.get(shareBtn).to({ scaleX: 0.9, scaleY: 0.9 }, 200, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).call(this.share, this);
        }, this);
        this.addChild(shareBtn);
        var shareText = new egret.TextField();
        shareText.text = 'SHARE';
        shareText.anchorX = 0.5;
        shareText.anchorY = 0.5;
        shareText.size = 40;
        shareText.textColor = 0xFFFFFF;
        shareText.bold = true;
        shareText.x = shareBtn.x;
        shareText.y = shareBtn.y;
        this.addChild(shareText);
        //动画
        egret.Tween.get(this).to({ alpha: 1 }, 800, egret.Ease.sineOut);
    };
    __egretProto__.nextLevel = function () {
    };
    __egretProto__.home = function () {
        egret.Tween.get(this).to({ alpha: 0 }, 500, egret.Ease.sineIn).call(function () {
            this.stage.addChild(new StartScene());
            this.parent.removeChild(this);
        });
    };
    __egretProto__.share = function () {
        document.getElementById('mask').style.display = 'block';
    };
    return PauseScene;
})(egret.DisplayObjectContainer);
PauseScene.prototype.__class__ = "PauseScene";
