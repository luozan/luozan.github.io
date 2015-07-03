/**
 * Created by Administrator on 2015/5/13.
 */
var game = (function (_super) {
    __extends(game, _super);
    function game() {
        _super.call(this);
        this.time = 30;
        this.timeText = null;
        this.bg = null;
        this.money = null;
        this.isRun = false;
        this.score = 0;
        this.scoreText = null;
        this.isFirst = true;
        this.timerObj = null;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }
    var __egretProto__ = game.prototype;
    __egretProto__.addToStage = function () {
        var bg = new egret.Shape();
        bg.width = 640;
        bg.height = 960;
        bg.graphics.beginFill(0x000000, 0);
        bg.graphics.drawRect(0, 0, 640, 960);
        bg.graphics.endFill();
        this.addChild(bg);
        this.bg = bg;
        this.createBG();
        this.createMoney();
        this.createUI();
    };
    __egretProto__.createBG = function () {
        for (var i = 0; i < 6; i++) {
            this.createAnimation();
        }
    };
    __egretProto__.createAnimation = function () {
        var money = new egret.Bitmap();
        money.texture = RES.getRes('d0_png');
        money.anchorX = 0.5;
        money.anchorY = 0.5;
        money.x = Math.random() * 300 + 65;
        money.y = Math.random() * 960;
        this.addChild(money);
        egret.Tween.get(money).to({ y: 1000, rotation: 1080 }, (1000 - money.y) * 2).call(function () {
            money.y = 0;
            money.rotation = 0;
            egret.Tween.get(money, { loop: true }).to({ y: 1000, rotation: 1080 }, 1400 + 500 * Math.random()).call(function () {
                money.x = Math.random() * 500 + 65;
            });
        });
    };
    __egretProto__.createUI = function () {
        var score = new egret.Bitmap();
        score.texture = RES.getRes('tmbg_png');
        score.anchorX = 0.5;
        score.x = this.stage.stageWidth / 2;
        score.y = 70;
        this.addChild(score);
        var scoreText = new egret.TextField();
        scoreText.text = '￥' + this.score + '万';
        scoreText.textColor = 0xFFFF00;
        scoreText.size = 45;
        scoreText.bold = true;
        scoreText.anchorX = 0.5;
        scoreText.anchorY = 0.5;
        scoreText.x = score.x;
        scoreText.y = score.y + score.height / 2;
        this.scoreText = scoreText;
        this.addChild(scoreText);
        var time = new egret.Bitmap();
        time.texture = RES.getRes('tmbg_png');
        time.anchorX = 0.5;
        time.x = score.x;
        time.y = 160;
        time.scaleX = 0.7;
        this.addChild(time);
        var clock = new egret.Bitmap();
        clock.texture = RES.getRes('tmicon_png');
        clock.anchorY = 0.5;
        clock.x = time.x - time.width / 2 + 50;
        clock.y = time.y + time.height / 2;
        this.addChild(clock);
        var timeText = new egret.TextField();
        timeText.text = this.time + '"';
        timeText.size = 45;
        timeText.bold = true;
        timeText.anchorX = 0.5;
        timeText.anchorY = 0.5;
        timeText.x = time.x + 30;
        timeText.y = clock.y;
        this.timeText = timeText;
        this.addChild(timeText);
    };
    __egretProto__.createMoney = function () {
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes('mb0_png');
        bg.anchorX = 0.5;
        bg.anchorY = 0.5;
        bg.x = this.stage.width / 2;
        bg.y = 750;
        this.addChild(bg);
        this.bg.touchEnabled = true;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (event) {
            if (this.isFirst) {
                this.timer();
                this.isFirst = false;
            }
            if (this.isRun) {
                return;
            }
            var money = new egret.Bitmap();
            money.texture = RES.getRes('m0_png');
            money.anchorX = 0.5;
            money.anchorY = 0.5;
            money.x = 320;
            money.y = 750;
            money.startOffset = event.stageY;
            money.start = event.stageY;
            this.addChildAt(money, 8);
            this.money = money;
            this.isRun = true;
        }, this);
        this.bg.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (event) {
            if (!this.money || event.stageY > this.money.start) {
                return;
            }
            this.money.y += (event.stageY - this.money.startOffset) * 1.5;
            this.money.startOffset = event.stageY;
        }, this);
        this.bg.addEventListener(egret.TouchEvent.TOUCH_END, function (event) {
            if (this.money && (event.stageY - this.money.start) < -50) {
                var self = this;
                egret.Tween.get(this.money).to({ y: -300 }, 130).call(this.remove, this, [this.money]);
            }
            else {
                if (this.money) {
                    this.money.parent.removeChild(this.money);
                    this.money = null;
                }
                this.isRun = false;
            }
        }, this);
    };
    __egretProto__.remove = function (money) {
        money.parent.removeChild(money);
        this.isRun = false;
        this.money = null;
        this.score += 100;
        this.scoreText.text = '￥' + this.score + '万';
    };
    __egretProto__.timer = function () {
        var timer = new egret.Timer(1000, 30);
        this.timerObj = timer;
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            this.time--;
            this.timeText.text = this.time + '"';
        }, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            this.createEnd();
        }, this);
        timer.start();
    };
    __egretProto__.createEnd = function () {
        var sprite = new egret.Sprite();
        sprite.width = 640;
        sprite.height = 960;
        sprite.touchEnabled = true;
        this.addChild(sprite);
        var sprite2 = new egret.Sprite();
        sprite2.anchorX = 0.5;
        sprite2.anchorY = 0.5;
        sprite2.x = 320;
        sprite2.y = 480;
        sprite.addChild(sprite2);
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes('dlgbg_png');
        bg.width = 640;
        bg.height = 480;
        bg.fillMode = egret.BitmapFillMode.REPEAT;
        sprite2.addChild(bg);
        var tip = new egret.TextField();
        tip.text = '恭喜你数了' + this.score + '万';
        tip.bold = true;
        tip.size = 55;
        tip.anchorX = 0.5;
        tip.anchorY = 0.5;
        tip.x = 320;
        tip.y = 80;
        tip.textAlign = egret.HorizontalAlign.CENTER;
        sprite2.addChild(tip);
        var replay = new egret.Bitmap();
        replay.texture = RES.getRes('start_png');
        replay.x = 40;
        replay.y = 250;
        replay.touchEnabled = true;
        replay.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.score = 0;
            this.time = 30;
            this.isFirst = true;
            this.timeText.text = this.time + '"';
            this.scoreText.text = '￥' + this.score + '万';
            this.timerObj.repeatCount = 30;
            console.log(this);
            sprite.parent.removeChild(sprite);
        }, this);
        sprite2.addChild(replay);
        var share = new egret.Bitmap();
        share.texture = RES.getRes('share_png');
        share.anchorX = 1;
        share.x = 600;
        share.y = 250;
        sprite2.addChild(share);
        var more = new egret.Bitmap();
        more.texture = RES.getRes('more_png');
        more.anchorX = 0.5;
        more.x = 320;
        more.y = 350;
        sprite2.addChild(more);
    };
    return game;
})(egret.DisplayObjectContainer);
game.prototype.__class__ = "game";
