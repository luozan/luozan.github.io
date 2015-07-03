/**
 * Created by Administrator on 2015/4/20.
 */
var LevelScene = (function (_super) {
    __extends(LevelScene, _super);
    function LevelScene() {
        _super.call(this);
        this.storage = null;
        this.isFirst = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }
    var __egretProto__ = LevelScene.prototype;
    //添加到舞台
    __egretProto__.addToStage = function () {
        if (!localStorage['DouPuGame']) {
            localStorage['DouPuGame'] = '{"0":{"isUnlock":true,"best":30000},"1":{"isUnlock":false,"best":40000},"2":{"isUnlock":false,"best":40000},"3":{"isUnlock":false,"best":50000},"4":{"isUnlock":false,"best":50000},"5":{"isUnlock":false,"best":30000},"6":{"isUnlock":false,"best":60000},"7":{"isUnlock":false,"best":60000},"8":{"isUnlock":false,"best":70000},"9":{"isUnlock":false,"best":60000},"10":{"isUnlock":false,"best":70000},"11":{"isUnlock":false,"best":50000},"12":{"isUnlock":false,"best":50000},"13":{"isUnlock":false,"best":40000},"14":{"isUnlock":false,"best":70000},"15":{"isUnlock":false,"best":50000},"16":{"isUnlock":false,"best":80000},"17":{"isUnlock":false,"best":120000},"18":{"isUnlock":false,"best":120000},"19":{"isUnlock":false,"best":120000}}';
            this.isFirst = true;
        }
        this.storage = JSON.parse(localStorage['DouPuGame']);
        this.createLevelUI();
        egret.Tween.get(this).to({ alpha: 1 }, 500, egret.Ease.sineOut);
    };
    //创建关卡选择UI
    __egretProto__.createLevelUI = function () {
        this.alpha = 0;
        //获取数据
        var level = RES.getRes('data').level;
        var levelSprite = new egret.Sprite();
        levelSprite.anchorX = 0.5;
        levelSprite.anchorY = 0.5;
        levelSprite.x = this.stage.stageWidth / 2;
        levelSprite.y = this.stage.stageHeight / 2 + 50;
        this.addChild(levelSprite);
        //标题
        var title = new egret.TextField();
        title.text = '选 择 关 卡';
        title.textColor = 0x333333;
        title.size = 55;
        title.anchorX = 0.5;
        title.anchorY = 1;
        title.bold = true;
        title.x = levelSprite.x;
        this.addChild(title);
        for (var i = 0; i < level.length; i++) {
            this.createLevelBtn(i, levelSprite);
        }
        title.y = levelSprite.y - levelSprite.height / 2 - 60;
    };
    //创建关卡按钮
    __egretProto__.createLevelBtn = function (id, sprite) {
        //创建按钮
        var levelBtnSprite = new egret.Sprite();
        levelBtnSprite.anchorX = 0.5;
        levelBtnSprite.anchorY = 0.5;
        levelBtnSprite.x = 50 + 120 * (id % 4);
        levelBtnSprite.y = 50 + 130 * (Math.floor(id / 4));
        sprite.addChild(levelBtnSprite);
        var levelBtn = new egret.Shape();
        levelBtn.graphics.lineStyle(2, 0x000000, 1);
        levelBtn.graphics.beginFill(0xFFFFFF, 1);
        levelBtn.graphics.drawRoundRect(0, 0, 100, 100, 50, 50);
        levelBtn.graphics.endFill();
        levelBtnSprite.addChild(levelBtn);
        //创建lock
        var lock = new egret.Bitmap();
        lock.texture = RES.getRes('lock');
        lock.anchorX = 0.5;
        lock.anchorY = 0.5;
        lock.visible = false;
        lock.x = levelBtn.width / 2;
        lock.y = levelBtn.height / 2;
        levelBtnSprite.addChild(lock);
        //创建按钮文字
        var levelBtnText = new egret.TextField();
        if (!this.storage[id + ''].isUnlock) {
            levelBtnText.visible = false;
            lock.visible = true;
        }
        else {
            levelBtnText.text = '' + (id + 1);
            //绑定事件
            levelBtnSprite.touchEnabled = true;
            levelBtnSprite.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
                levelBtnSprite.scaleX = 0.9;
                levelBtnSprite.scaleY = 0.9;
            }, this);
            levelBtnSprite.addEventListener(egret.TouchEvent.TOUCH_END, function () {
                levelBtnSprite.scaleX = 1;
                levelBtnSprite.scaleY = 1;
            }, this);
            levelBtnSprite.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
                levelBtnSprite.scaleX = 1;
                levelBtnSprite.scaleY = 1;
            }, this);
            var self = this;
            levelBtnSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                self.stage.addChild(new GameScene(id, self.isFirst));
                self.stage.removeChild(self);
            }, this);
        }
        levelBtnText.textColor = 0x000000;
        levelBtnText.size = 40;
        levelBtnText.anchorX = 0.5;
        levelBtnText.anchorY = 0.5;
        levelBtnText.x = levelBtn.width / 2;
        levelBtnText.y = levelBtn.height / 2;
        levelBtnSprite.addChild(levelBtnText);
    };
    return LevelScene;
})(egret.DisplayObjectContainer);
LevelScene.prototype.__class__ = "LevelScene";
