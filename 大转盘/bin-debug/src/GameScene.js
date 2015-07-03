/**
 * Created by Administrator on 2015/5/14.
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene(arr, userInfo) {
        _super.call(this);
        this.number = 8;
        this.current = 0;
        this.IMAGE_WIDTH = 30;
        this.IMAGE_HEIGHT = 48;
        this.isHit = false;
        this.token = null;
        this.fil = /^1[3|4|5|8][0-9]\d{8}$/;
        this.arr = arr;
        this.userInfo = userInfo;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }
    var __egretProto__ = GameScene.prototype;
    __egretProto__.addToStage = function () {
        this.createUI();
    };
    __egretProto__.createUI = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var angle = 45 / 2;
        //背景
        var background = new egret.Bitmap();
        background.texture = RES.getRes('bg_jpg');
        this.addChild(background);
        //底盘
        var roulSprite = new egret.Sprite();
        roulSprite.anchorX = 0.5;
        roulSprite.anchorY = 0.5;
        roulSprite.isRun = false;
        roulSprite.x = stageW / 2;
        roulSprite.y = stageH / 2;
        this.addChild(roulSprite);
        var roul = new egret.Bitmap();
        roul.texture = RES.getRes('roul_png');
        roulSprite.addChild(roul);
        for (var i = 0; i < 8; i++) {
            var sprite = new egret.Sprite();
            sprite.anchorX = 0.5;
            sprite.anchorY = 2.5;
            sprite.x = roul.width / 2;
            sprite.y = roul.height / 2;
            sprite.rotation = angle + (45 * (7 - i));
            roulSprite.addChild(sprite);
            var bitmap = new egret.Bitmap();
            bitmap.texture = this.arr[(7 - i)].texture;
            bitmap.width = this.IMAGE_WIDTH;
            bitmap.anchorX = 0.5;
            bitmap.height = this.IMAGE_HEIGHT;
            sprite.addChild(bitmap);
            var text = new egret.TextField();
            text.text = this.arr[(7 - i)].text;
            text.size = 20;
            text.anchorX = 0.5;
            text.y = 53;
            text.textAlign = egret.HorizontalAlign.CENTER;
            sprite.addChild(text);
            text.x = sprite.width / 2;
            bitmap.x = sprite.width / 2;
        }
        //指针
        var pointer = new egret.Bitmap();
        pointer.texture = RES.getRes('pointer_png');
        pointer.anchorX = 0.5;
        pointer.anchorY = 0.5;
        pointer.x = stageW / 2;
        pointer.y = stageH / 2 - 20;
        pointer.touchEnabled = true;
        var self = this;
        pointer.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (roulSprite.isRun) {
                return;
            }
            roulSprite.isRun = true;
            self.number = Math.floor(Math.random() * 7 + 1);
            //创建POST请求
            var url = "http://yz.doupu.cn/number.php";
            var loader = new egret.URLLoader();
            loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
            loader.addEventListener(egret.Event.COMPLETE, function (event) {
                var loader = event.target;
                var data = JSON.parse(loader.data);
                if (data.state == 'error') {
                    tipSprite.visible = true;
                    tipText.text = data.errorMessge;
                    return;
                }
                this.number = data.number;
                this.isHit = data.isHit;
                this.token = data.token;
                var angle2 = 14400 + ((7 - this.number) * 45) + 5 + 35 * Math.random();
                egret.Tween.get(roulSprite).to({ rotation: angle2 }, 12000, egret.Ease.circInOut).call(function () {
                    roulSprite.rotation %= 360;
                    for (var i = 0; i < 16; i++) {
                        arr[i].rotation %= 360;
                    }
                    roulSprite.isRun = false;
                    borderSprite.visible = true;
                    if (!!(self.arr[self.number].texture)) {
                        prise.texture = self.arr[self.number].texture;
                    }
                    else {
                        console.log(self.arr[self.number].texture, self.arr, self.number);
                        prise.texture = RES.getRes('');
                    }
                    text.text = data.text;
                    prise.visible = true;
                    inputBG.visible = false;
                    inputText.visible = false;
                    button.visible = true;
                    button2.visible = false;
                });
            }, this);
            var request = new egret.URLRequest(url);
            request.method = egret.URLRequestMethod.POST;
            request.data = new egret.URLVariables("test=ok");
            loader.load(request);
        }, this);
        this.addChild(pointer);
        //边框
        var roulBorder = new egret.Bitmap();
        roulBorder.texture = RES.getRes('roul_border_png');
        roulBorder.anchorX = 0.5;
        roulBorder.anchorY = 0.5;
        roulBorder.x = stageW / 2;
        roulBorder.y = stageH / 2;
        this.addChild(roulBorder);
        //走马灯
        var arr = [];
        var n = 0;
        for (var i = 0; i < 16; i++) {
            var light = new egret.Bitmap();
            light.texture = RES.getRes('light_' + (n + 1) + '_png');
            light.anchorOffsetX = light.width / 2;
            light.anchorOffsetY = 250;
            light.x = stageW / 2;
            light.y = stageH / 2;
            light.rotation = angle * (i - 1);
            this.addChild(light);
            n = Math.floor((i + 1) / 4);
            arr.push(light);
        }
        var self = this;
        this.addEventListener(egret.Event.ENTER_FRAME, function () {
            var sum = Math.round(roulSprite.rotation / angle);
            if (sum == self.current || sum == 0) {
                sum = 0;
            }
            else {
                sum -= self.current;
                self.current = sum + self.current;
            }
            for (var i = 0; i < 16; i++) {
                arr[i].rotation += angle * sum;
            }
        }, this);
        //容器
        var borderSprite = new egret.Sprite();
        borderSprite.width = this.stage.stageWidth;
        borderSprite.height = this.stage.stageHeight;
        borderSprite.visible = false;
        borderSprite.touchEnabled = true;
        this.addChild(borderSprite);
        var borderShape = new egret.Shape();
        borderShape.width = borderSprite.width;
        borderShape.height = borderSprite.height;
        borderSprite.addChild(borderShape);
        //弹窗
        var border = new egret.Bitmap();
        border.texture = RES.getRes('border_png');
        border.anchorX = 0.5;
        border.anchorY = 0.5;
        border.x = stageW / 2;
        border.y = stageH / 2;
        borderSprite.addChild(border);
        //文字
        var text = new egret.TextField();
        //text.text = (8-this.number)+'等奖';
        text.text = '输入手机号码';
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.anchorX = 0.5;
        text.anchorY = 0.5;
        text.x = border.x;
        text.y = border.y - 50;
        borderSprite.addChild(text);
        //图片
        var prise = new egret.Bitmap();
        prise.texture = this.arr[0].texture;
        prise.width = this.IMAGE_WIDTH * 2;
        prise.height = this.IMAGE_HEIGHT * 2;
        prise.anchorX = 0.5;
        prise.anchorY = 0.5;
        prise.x = border.x;
        prise.y = border.y + 30;
        borderSprite.addChild(prise);
        //输入框
        var inputBG = new egret.Shape();
        inputBG.anchorX = 0.5;
        inputBG.anchorY = 0.5;
        inputBG.x = border.x;
        inputBG.y = border.y;
        inputBG.graphics.beginFill(0xffffff, 1);
        inputBG.graphics.drawRect(0, 0, 200, 30);
        inputBG.graphics.endFill();
        inputBG.visible = false;
        borderSprite.addChild(inputBG);
        //文本框
        var inputText = new egret.TextField();
        inputText.type = egret.TextFieldType.INPUT;
        inputText.textColor = 0x333333;
        inputText.text = '';
        inputText.size = 23;
        inputText.anchorX = 0.5;
        inputText.anchorY = 0.5;
        inputText.width = 200;
        inputText.visible = false;
        inputText.x = border.x;
        inputText.y = border.y;
        borderSprite.addChild(inputText);
        //按钮
        var button = new egret.Bitmap();
        button.texture = RES.getRes('ok_png');
        button.anchorX = 0.5;
        button.anchorY = 0.5;
        button.x = border.x;
        button.y = border.y + 130;
        button.touchEnabled = true;
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this.isHit) {
                text.text = '输入手机号码';
                prise.visible = false;
                inputBG.visible = true;
                inputText.visible = true;
                button2.visible = true;
                button.visible = true;
            }
            else {
                borderSprite.visible = false;
            }
        }, this);
        borderSprite.addChild(button);
        //按钮2
        var button2 = new egret.Bitmap();
        button2.texture = RES.getRes('ok_png');
        button2.anchorX = 0.5;
        button2.anchorY = 0.5;
        button2.x = border.x;
        button2.y = border.y + 130;
        button2.touchEnabled = true;
        button2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this.fil.test(inputText.text)) {
                //发送领奖信息
                alert(inputText.text + ' 令牌:' + this.token);
                //隐藏弹窗
                borderSprite.visible = false;
                //如果提交成功添加到中奖信息
                this.userInfo.push({ tel: inputText.text, prise: '几等奖' });
            }
            else {
                tipText.text = '号码不正确';
                tipSprite.visible = true;
            }
        }, this);
        borderSprite.addChild(button2);
        //Billboard
        var billboard = new egret.Bitmap();
        billboard.texture = RES.getRes('board_png');
        this.addChild(billboard);
        var currentUser = 3;
        for (var i = 0; i < 3; i++) {
            var user = this.userInfo[i];
            var title = new egret.TextField();
            title.text = user.tel + ' ' + user.prise;
            title.anchorY = 0.5;
            title.y = billboard.height / 2;
            title.x = title.width * i;
            title.size = 23;
            this.addChild(title);
            egret.Tween.get(title).to({ x: -title.width }, (title.x + title.width) * 9.5).call(function (title) {
                if (currentUser >= self.userInfo.length) {
                    currentUser = 0;
                }
                var user = self.userInfo[currentUser];
                title.text = user.tel + ' ' + user.prise;
                currentUser++;
                title.x = stageW + 120;
                egret.Tween.get(title, { loop: true }).to({ x: -title.width }, (title.x + title.width) * 9.5).call(function () {
                    if (currentUser >= self.userInfo.length) {
                        currentUser = 0;
                    }
                    var user = self.userInfo[currentUser];
                    title.text = user.tel + ' ' + user.prise;
                    currentUser++;
                    title.x = stageW;
                });
            }.bind(this, title));
        }
        //tip
        var tipSprite = new egret.Sprite();
        tipSprite.anchorX = 0.5;
        tipSprite.anchorY = 0.5;
        tipSprite.visible = false;
        tipSprite.x = stageW / 2;
        tipSprite.y = stageH / 2;
        this.addChild(tipSprite);
        var tipBG = new egret.Bitmap();
        tipBG.texture = RES.getRes('border_png');
        tipSprite.addChild(tipBG);
        tipSprite.width = tipBG.width;
        tipSprite.height = tipBG.height;
        var tipText = new egret.TextField();
        tipText.text = '剩余0次抽奖机会';
        tipText.textAlign = egret.HorizontalAlign.CENTER;
        tipText.size = 23;
        tipText.anchorX = 0.5;
        tipText.anchorY = 0.5;
        tipText.x = tipBG.width / 2;
        tipText.y = tipBG.height / 2;
        tipSprite.addChild(tipText);
        var tipButton = new egret.Bitmap();
        tipButton.texture = RES.getRes('ok_png');
        tipButton.anchorX = 0.5;
        tipButton.anchorY = 0.5;
        tipButton.x = tipText.x;
        tipButton.y = tipText.y + 130;
        tipButton.touchEnabled = true;
        tipButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            tipSprite.visible = false;
        }, this);
        tipSprite.addChild(tipButton);
    };
    return GameScene;
})(egret.DisplayObjectContainer);
GameScene.prototype.__class__ = "GameScene";
