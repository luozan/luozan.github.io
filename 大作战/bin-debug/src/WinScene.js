/**
 * Created by Administrator on 2015/5/5.
 */
var WinScene = (function (_super) {
    __extends(WinScene, _super);
    function WinScene(levelID, time) {
        _super.call(this);
        this.storage = null;
        this.levelID = levelID;
        this.time = time;
        this.storage = JSON.parse(localStorage['DouPuGame']);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = WinScene.prototype;
    __egretProto__.onAddToStage = function () {
        if (this.levelID == 19) {
            this.stage.addChild(new LevelScene());
            this.parent.removeChild(this);
            return;
        }
        this.openLevel();
        this.createSprite();
    };
    __egretProto__.openLevel = function () {
        var item = this.storage[this.levelID + 1];
        if (!item.isUnlock) {
            this.storage[this.levelID + 1].isUnlock = true;
        }
        localStorage['DouPuGame'] = JSON.stringify(this.storage);
    };
    __egretProto__.createSprite = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var width = 0.7 * stageW;
        //this.y = -stageH;
        this.alpha = 0;
        //标题
        var title = new egret.TextField();
        title.text = '  通 过 第 ' + (this.levelID + 1) + ' 关！';
        title.textColor = 0xFF6A6A;
        title.size = 55;
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
        timeTitle.text = '花费时间';
        timeTitle.textColor = 0xFFFFFF;
        timeTitle.size = 30;
        timeTitle.bold = true;
        timeTitle.anchorX = 0.5;
        timeTitle.anchorY = 0.5;
        timeTitle.x = frame.x;
        timeTitle.y = frame.y - 70;
        this.addChild(timeTitle);
        var time = new egret.TextField();
        time.text = this.formatTime(this.time);
        time.textColor = 0xFFFFFF;
        time.size = 50;
        time.bold = true;
        time.anchorX = 0.5;
        time.anchorY = 0.5;
        time.x = frame.x;
        time.y = frame.y - 30;
        this.addChild(time);
        var bestTimeTitle = new egret.TextField();
        bestTimeTitle.text = '标准时间';
        bestTimeTitle.textColor = 0xFFFFFF;
        bestTimeTitle.size = 30;
        bestTimeTitle.bold = true;
        bestTimeTitle.anchorX = 0.5;
        bestTimeTitle.anchorY = 0.5;
        bestTimeTitle.x = frame.x;
        bestTimeTitle.y = frame.y + 20;
        this.addChild(bestTimeTitle);
        var bestTime = new egret.TextField();
        bestTime.text = this.formatTime(this.storage[this.levelID].best);
        bestTime.textColor = 0xFFFFFF;
        bestTime.size = 50;
        bestTime.bold = true;
        bestTime.anchorX = 0.5;
        bestTime.anchorY = 0.5;
        bestTime.x = frame.x;
        bestTime.y = frame.y + 60;
        this.addChild(bestTime);
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
            egret.Tween.get(nextLevelBtn).to({ scaleX: 0.9, scaleY: 0.9 }, 200, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).call(this.nextLevel, this);
        }, this);
        this.addChild(nextLevelBtn);
        var nextLevelText = new egret.TextField();
        nextLevelText.text = '下 一 关';
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
        homeText.text = '返 回';
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
            egret.Tween.get(shareBtn).to({ scaleX: 0.9, scaleY: 0.9 }, 200, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).call(this.share, shareBtn);
        }, this);
        this.addChild(shareBtn);
        var shareText = new egret.TextField();
        shareText.text = '分 享';
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
        egret.Tween.get(this).to({ alpha: 0 }, 500, egret.Ease.sineIn).call(function () {
            this.stage.addChild(new GameScene(this.levelID + 1, false));
            this.parent.removeChild(this);
        });
    };
    __egretProto__.home = function () {
        egret.Tween.get(this).to({ alpha: 0 }, 500, egret.Ease.sineIn).call(function () {
            this.stage.addChild(new StartScene());
            this.parent.removeChild(this);
        });
    };
    __egretProto__.share = function () {
        this.touchEnabled = true;
        document.getElementById('mask').style.display = 'block';
    };
    __egretProto__.formatTime = function (time) {
        var time = Math.floor(time / 1000);
        var hour = Math.floor(time / 3600);
        var min = Math.floor((time - 3600 * hour) / 60);
        var s = Math.floor(time % 60);
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (min < 10) {
            min = '0' + min;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return hour + ':' + min + ':' + s;
    };
    return WinScene;
})(egret.DisplayObjectContainer);
WinScene.prototype.__class__ = "WinScene";
