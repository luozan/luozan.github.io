/**
 * Created by Administrator on 2015/4/20.
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene(LevelID, isFirst) {
        _super.call(this);
        this.base = [];
        this.animationList = [];
        this.begin = null;
        this.end = null;
        this.lineToPoint = { x: 0, y: 0 };
        this.graphics = new egret.Shape();
        this.computerTotal = 0;
        this.playerTotal = 0;
        this.startTime = 0;
        this.isFirst = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
        this.data = RES.getRes('data').level[LevelID];
        this.levelID = LevelID;
        if (isFirst) {
            this.isFirst = true;
        }
    }
    var __egretProto__ = GameScene.prototype;
    //添加到舞台
    __egretProto__.addToStage = function () {
        this.alpha = 0;
        this.stageMove();
        this.createPlayer();
        this.createComputer();
        this.createNeutral();
        this.monsterManager = new MonsterManager();
        this.monsterManager.gameScene = this;
        this.monsterManager.createTimer();
        this.monsterManager.startCheckFight();
        if (this.isFirst) {
            this.createTutorial();
        }
        else {
            this.monsterManager.runAI();
        }
        var currentLevel = new egret.TextField();
        currentLevel.text = '第 ' + (this.levelID + 1) + ' 关';
        currentLevel.anchorX = 1;
        currentLevel.x = this.stage.stageWidth - 30;
        currentLevel.y = 10;
        currentLevel.textColor = 0x000000;
        this.addChild(currentLevel);
        var replay = new egret.Bitmap();
        replay.texture = RES.getRes('replay');
        replay.anchorX = 0.5;
        replay.anchorY = 0.5;
        replay.x = replay.width / 2 + 10;
        replay.y = replay.height / 2 - 5;
        replay.touchEnabled = true;
        replay.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.monsterManager.stopCheckFight();
            this.monsterManager.stopTimer();
            this.stage.addChild(new GameScene(this.levelID, false));
            this.parent.removeChild(this);
        }, this);
        this.addChild(replay);
        this.startTime = new Date().getTime();
        egret.Tween.get(this).to({ alpha: 1 }, 500, egret.Ease.sineOut);
        //var sprite = new egret.Sprite();
        //sprite.width = 200;
        //sprite.height = 200;
        //sprite.anchorX = 0.5;
        //sprite.anchorY = 0.5;
        //sprite.x = 160;
        //sprite.y = 800;
        //this.addChild(sprite);
        //this.touchEnabled = true;
        //this.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
        //    this.moveTo(1,160,800);
        //},this);
    };
    //创建玩家的基地
    __egretProto__.createPlayer = function () {
        var playerData = this.data.player.data;
        this.playerColor = Number(this.data.player.color);
        for (var i = 0; i < playerData.length; i++) {
            var item = playerData[i];
            var sprite = new egret.Sprite();
            this.addChild(sprite);
            this.createRound(item, this.playerColor, i, sprite, 'player');
        }
    };
    //创建敌人的基地
    __egretProto__.createComputer = function () {
        var computer = this.data.computer.data;
        this.computerColor = Number(this.data.computer.color);
        for (var i = 0; i < computer.length; i++) {
            var item = computer[i];
            var sprite = new egret.Sprite();
            this.addChild(sprite);
            this.createRound(item, this.computerColor, i, sprite, 'computer');
        }
    };
    //创建中立基地
    __egretProto__.createNeutral = function () {
        var neutral = this.data.neutral.data;
        this.neutralColor = Number(this.data.neutral.color);
        for (var i = 0; i < neutral.length; i++) {
            var item = neutral[i];
            var sprite = new egret.Sprite();
            this.addChild(sprite);
            this.createRound(item, this.neutralColor, i, sprite, 'neutral');
        }
    };
    //创建基地
    __egretProto__.createRound = function (item, color, id, sprite, type) {
        var shape = new egret.Shape();
        shape.anchorX = 0.5;
        shape.anchorY = 0.5;
        shape.x = item.x;
        shape.y = item.y;
        var r = item.size;
        shape.graphics.lineStyle(2, 0x666666, 1);
        shape.graphics.beginFill(color, 1);
        shape.graphics.drawCircle(r, r, r);
        shape.graphics.endFill();
        shape.id = this.base.length;
        shape.type = type;
        shape.radius = r;
        shape.color = color;
        shape.speed = item.speed;
        shape.isFighting = false;
        shape.playerBase = [];
        shape.computerBase = [];
        shape.neutralBase = [];
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.roundTouchBegin, this);
        shape.addEventListener(egret.TouchEvent.TOUCH_END, this.roundTouchEnd, this);
        shape.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.roundTouchEndOutSide, this);
        //shape.addEventListener(egret.TouchEvent.TOUCH_TAP,this.roundTap,this);
        shape.number = item.initialNumber;
        this.base.push(shape);
        sprite.addChild(shape);
        //创建个数
        var text = new egret.TextField();
        text.text = '' + Math.floor(shape.number);
        text.anchorX = 0.5;
        text.anchorY = 0.5;
        text.x = shape.x;
        text.y = shape.y;
        sprite.addChild(text);
        if (type == 'neutral') {
            text.visible = false;
        }
        if (type == 'player') {
            var base = shape.playerBase;
            this.playerTotal += item.initialNumber;
        }
        else if (type == 'computer') {
            var base = shape.computerBase;
            this.computerTotal += item.initialNumber;
        }
        else {
            var base = shape.neutralBase;
        }
        for (var s = 0; s < item.initialNumber; s++) {
            var shap = this.createSmallCircle(color, item.x, item.y, item.size);
            base.push(shap);
        }
    };
    //事件
    __egretProto__.roundTouchBegin = function (event) {
        if (event.target.playerBase.length <= 0) {
            return;
        }
        this.begin = event.target;
    };
    __egretProto__.roundTouchEnd = function (event) {
        if (event.target == this.begin || !this.begin) {
            return;
        }
        else {
            this.moveTo(this.begin, event.target);
        }
        this.end = event.target;
    };
    __egretProto__.roundTouchEndOutSide = function () {
        this.begin = null;
        this.graphics.graphics.clear();
    };
    //private roundTap(event):void{
    //
    //}
    __egretProto__.stageMove = function () {
        var self = this;
        this.addChild(this.graphics);
        var sprite = new egret.Shape();
        sprite.graphics.beginFill(0x000000, 0);
        sprite.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        sprite.graphics.endFill();
        this.addChild(sprite);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (event) {
            if (self.begin) {
                self.graphics.graphics.clear();
                self.graphics.graphics.lineStyle(5, 0x00FF00, 0.6);
                self.graphics.graphics.moveTo(this.begin.x, this.begin.y);
                self.graphics.graphics.lineTo(event.stageX, event.stageY);
            }
        }, this);
    };
    //创建小圆圈
    __egretProto__.createSmallCircle = function (color, x, y, size) {
        var shape = new egret.Shape();
        shape.x = x;
        shape.y = y;
        shape.anchorOffsetX = Math.random() * 4 * size - size * 2;
        shape.anchorOffsetY = Math.random() * 4 * size - size * 2;
        while (!(this.isInCircle(0, 0, size + 10, size + 30, shape.anchorOffsetX, shape.anchorOffsetY))) {
            shape.anchorOffsetX = Math.random() * size * 4 - size * 2;
            shape.anchorOffsetY = Math.random() * size * 4 - size * 2;
        }
        shape.graphics.beginFill(color, 1);
        shape.graphics.drawCircle(0, 0, 3);
        shape.graphics.endFill();
        shape.isMove = false;
        shape.anchor = { x: shape.anchorOffsetX, y: shape.anchorOffsetY };
        this.addChildAt(shape, 0);
        egret.Tween.get(shape, { loop: true }).to({ rotation: 360 }, Math.random() * 5000 + 3000);
        return shape;
    };
    //移动
    __egretProto__.moveTo = function (start, end) {
        var startBase = start.playerBase;
        var offset = (start.radius - end.radius);
        var distance = Math.sqrt((end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y));
        for (var i = 0; i < startBase.length;) {
            if (startBase[i].isMove) {
                i++;
                continue;
            }
            //egret.Tween.removeTweens(arr[1]);
            startBase[i].isMove = true;
            if (start.type == 'player') {
                start.number--;
            }
            egret.Tween.get(startBase[i], {}, {}, true).to({ anchorOffsetX: 0, anchorOffsetY: 0, x: end.x, y: end.y }, distance * (2 + Math.random())).call(this.rotate, this, [startBase[i], offset, end]);
            start.playerBase.splice(i, 1);
        }
        start.parent.getChildAt(1).text = Math.floor(start.number) + '';
        end.parent.getChildAt(1).text = Math.floor(end.number) + '';
    };
    __egretProto__.rotate = function (object, offset, end) {
        if (object.anchor.x < 0) {
            object.anchor.x += offset;
        }
        else {
            object.anchor.x -= offset;
        }
        if (object.anchor.y < 0) {
            object.anchor.y += offset;
        }
        else {
            object.anchor.y -= offset;
        }
        var self = this;
        egret.Tween.get(object, {}, {}, true).to({ anchorOffsetX: object.anchor.x, anchorOffsetY: object.anchor.y, rotation: 0 }, 500).call(function () {
            object.isMove = false;
            end.playerBase.push(object);
            if (end.type == 'player') {
                end.number++;
                end.parent.getChildAt(1).text = Math.floor(end.number) + '';
            }
            if (!end.isFighting && end.type != 'player') {
                self.startFight(end);
            }
            egret.Tween.get(object, { loop: true }, {}, true).to({ rotation: 360 }, Math.random() * 5000 + 3000);
        });
    };
    __egretProto__.startFight = function (end) {
        end.isFighting = true;
        var bar = new Bar(this.playerColor, end);
        this.addChild(bar);
        if (end.type == 'neutral') {
            bar.visible = false;
        }
        end.bar = bar;
        this.monsterManager.addFight('player', end);
    };
    __egretProto__.isInCircle = function (x, y, r1, r2, x2, y2) {
        var distance = (x2 - x) * (x2 - x) + (y2 - y) * (y2 - y);
        if (r1 * r1 < distance && distance < r2 * r2) {
            return true;
        }
        else {
            return false;
        }
    };
    __egretProto__.createTutorial = function () {
        var sprite = new egret.Sprite();
        sprite.x = 0;
        sprite.y = 0;
        this.addChild(sprite);
        //shape
        var shape = new egret.Shape();
        this.addChildAt(shape, 0);
        //提示
        var tipText = new egret.TextField();
        tipText.text = '用手指点击你的原子';
        tipText.textColor = 0x000000;
        tipText.anchorX = 0.5;
        tipText.anchorY = 0.5;
        tipText.x = this.stage.stageWidth / 2;
        tipText.textAlign = egret.HorizontalAlign.CENTER;
        tipText.y = 400;
        sprite.addChild(tipText);
        //move
        var finger = new egret.Bitmap();
        finger.texture = RES.getRes('move');
        finger.anchorOffsetX = 53;
        finger.anchorOffsetY = 53;
        finger.x = 70;
        finger.y = 370;
        sprite.addChild(finger);
        var func = function () {
            shape.graphics.clear();
            shape.graphics.lineStyle(5, 0x00FF00, 0.6);
            shape.graphics.moveTo(320, 800);
            shape.graphics.lineTo(finger.x, finger.y);
        };
        egret.Tween.get(finger).wait(2000).to({ x: 320, y: 800 }, 2000, egret.Ease.sineOut).call(function () {
            tipText.text = '按住手指拖动到目的地';
        }).wait(1000).to({ scaleY: 0.9 }, 300).call(function () {
            finger.texture = RES.getRes('tap');
            sprite.addEventListener(egret.Event.ENTER_FRAME, func, this);
        }).wait(2000).to({ x: 200, y: 550 }, 1000, egret.Ease.sineOut).wait(3000).call(function () {
            tipText.text = '松开手指后士兵就会前往目的地';
        }).wait(4000).call(function () {
            finger.visible = false;
            sprite.removeEventListener(egret.Event.ENTER_FRAME, func, this);
            shape.parent.removeChild(shape);
            tipText.text = '占领中立的原子增强兵力\n消灭敌人将会获得胜利\n接下请亲自试试吧';
        }).wait(7000).call(function () {
            sprite.parent.removeChild(sprite);
        });
    };
    return GameScene;
})(egret.DisplayObjectContainer);
GameScene.prototype.__class__ = "GameScene";
