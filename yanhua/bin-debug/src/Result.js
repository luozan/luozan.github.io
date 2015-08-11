var Result = (function (_super) {
    __extends(Result, _super);
    function Result() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = Result.prototype;
    __egretProto__.onAddToStage = function (event) {
        this.createGameScene();
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    __egretProto__.createGameScene = function () {
        console.log('xxx');
        var sky = this.createBitmapByName("background");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var again = new egret.Bitmap();
        again.anchorX = 0.5;
        again.anchorY = 0.5;
        again.x = 345 - 140;
        again.y = 480;
        again.texture = RES.getRes('again');
        again.touchEnabled = true;
        var self = this;
        again.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            self.stage.addChild(new Main());
            self.stage.removeChild(self);
            window['clearBigBoom']();
            egret.clearInterval(window['currentInterval']);
        }, this);
        again.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            again.scaleX = 0.9;
            again.scaleY = 0.9;
        }, this);
        again.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            again.scaleX = 1;
            again.scaleY = 1;
        }, this);
        again.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            again.scaleX = 1;
            again.scaleY = 1;
        }, this);
        this.addChild(again);
        var share = new egret.Bitmap();
        share.anchorX = 0.5;
        share.anchorY = 0.5;
        share.x = 345 + 140;
        share.y = 480;
        share.texture = RES.getRes('btn_share');
        share.touchEnabled = true;
        share.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            document.getElementById('share').style.display = 'block';
        }, this);
        share.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            share.scaleX = 0.9;
            share.scaleY = 0.9;
        }, this);
        share.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            share.scaleX = 1;
            share.scaleY = 1;
        }, this);
        share.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            share.scaleX = 1;
            share.scaleY = 1;
        }, this);
        this.addChild(share);
        var more = new egret.Bitmap();
        more.texture = RES.getRes('more');
        more.anchorX = 0.5;
        more.anchorY = 0.5;
        more.x = 345;
        more.y = 560;
        more.touchEnabled = true;
        more.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            location.href = 'http://mp.weixin.qq.com/s?__biz=MzA4ODA2NzUxNg==&mid=209345506&idx=4&sn=00045e860da1453df142c2bb43acdca2#rd';
        }, this);
        more.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            more.scaleX = 0.9;
            more.scaleY = 0.9;
        }, this);
        more.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            more.scaleX = 1;
            more.scaleY = 1;
        }, this);
        more.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            more.scaleX = 1;
            more.scaleY = 1;
        }, this);
        this.addChild(more);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    __egretProto__.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Result;
})(egret.DisplayObjectContainer);
Result.prototype.__class__ = "Result";
