/**
 * Created by Administrator on 2015/5/5.
 */
var LoseScene = (function (_super) {
    __extends(LoseScene, _super);
    function LoseScene(levelID) {
        _super.call(this);
        this.levelID = levelID;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = LoseScene.prototype;
    __egretProto__.onAddToStage = function () {
        this.createSprite();
    };
    __egretProto__.createSprite = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var width = 0.7 * stageW;
        //this.y = -stageH;
        this.alpha = 0;
        //����
        var title = new egret.TextField();
        title.text = '失 败';
        title.textColor = 0x666666;
        title.size = 55;
        title.bold = true;
        title.anchorX = 0.5;
        title.anchorY = 0.5;
        title.x = stageW / 2;
        title.y = stageH / 2 - 300;
        this.addChild(title);
        // ����
        var replayBtn = new egret.Shape();
        replayBtn.anchorX = 0.5;
        replayBtn.anchorY = 0.5;
        replayBtn.x = title.x;
        replayBtn.y = stageH / 2 - 170;
        replayBtn.graphics.beginFill(0x333333, 1);
        replayBtn.graphics.drawRoundRect(0, 0, width, 100, 20, 20);
        replayBtn.graphics.endFill();
        //���¼�
        replayBtn.touchEnabled = true;
        replayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            replayBtn.touchEnabled = false;
            home.touchEnabled = false;
            egret.Tween.get(replayBtn).to({ scaleX: 0.9, scaleY: 0.9 }, 200, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).call(this.replay, this);
        }, this);
        this.addChild(replayBtn);
        var replayText = new egret.TextField();
        replayText.text = '重 玩';
        replayText.anchorX = 0.5;
        replayText.anchorY = 0.5;
        replayText.size = 40;
        replayText.textColor = 0xFFFFFF;
        replayText.bold = true;
        replayText.x = replayBtn.x;
        replayText.y = replayBtn.y;
        this.addChild(replayText);
        // �ص���ҳ
        var home = new egret.Shape();
        home.anchorX = 0.5;
        home.anchorY = 0.5;
        home.x = title.x;
        home.y = stageH / 2 - 50;
        home.graphics.beginFill(0x333333, 1);
        home.graphics.drawRoundRect(0, 0, width, 100, 20, 20);
        home.graphics.endFill();
        //���¼�
        home.touchEnabled = true;
        home.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            home.touchEnabled = false;
            replayText.touchEnabled = false;
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
        // ����ť
        var shareBtn = new egret.Shape();
        shareBtn.anchorX = 0.5;
        shareBtn.anchorY = 0.5;
        shareBtn.x = title.x;
        shareBtn.y = stageH / 2 + 70;
        shareBtn.graphics.beginFill(0x333333, 1);
        shareBtn.graphics.drawRoundRect(0, 0, width, 100, 20, 20);
        shareBtn.graphics.endFill();
        //���¼�
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
        //����
        egret.Tween.get(this).to({ alpha: 1 }, 800, egret.Ease.sineOut);
    };
    __egretProto__.replay = function () {
        egret.Tween.get(this).to({ alpha: 0 }, 500, egret.Ease.sineIn).call(function () {
            this.stage.addChild(new GameScene(this.levelID, false));
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
    return LoseScene;
})(egret.DisplayObjectContainer);
LoseScene.prototype.__class__ = "LoseScene";
