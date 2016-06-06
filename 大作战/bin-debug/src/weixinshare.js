var need_jssdk = true;
/////////////////////////////////////////////////
var debug_type = false; //调试模式
/////////////////////////////////////////////
var WeiXinShare = (function (_super) {
    __extends(WeiXinShare, _super);
    function WeiXinShare() {
        _super.call(this);
        this.shareType = "outside"; //浏览位置 微信外
        //public shareType="weixin";//浏览位置 微信内
        this.jssdk = new JSSDK();
        if (navigator.userAgent.toLowerCase().toString().indexOf("micromessenger") > 0) {
            this.shareType = "weixin";
        }
    }
    var __egretProto__ = WeiXinShare.prototype;
    __egretProto__.createShareButton = function (x, y, size, self) {
        if (this.shareType == "weixin") {
            var sharebtn = new egret.Bitmap();
            sharebtn.texture = RES.getRes("sharebtn");
            sharebtn.name = "sharebtn";
            sharebtn.width = size;
            sharebtn.height *= size / sharebtn.measuredWidth;
            sharebtn.anchorX = 0.5;
            sharebtn.anchorY = 0.5;
            sharebtn.x = x + size / 2;
            sharebtn.y = y + sharebtn.height / 2;
            self.addChild(sharebtn);
            sharebtn.touchEnabled = true;
            sharebtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
                egret.Tween.get(sharebtn).to({ "scaleX": 0.8, "scaleY": 0.8 }, 100);
            }, this);
            sharebtn.addEventListener(egret.TouchEvent.TOUCH_END, function () {
                egret.Tween.get(sharebtn).to({ "scaleX": 1, "scaleY": 1 }, 500);
            }, this);
            sharebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                this.share_tap(self);
            }, this);
        }
    };
    __egretProto__.weiXinShareSet = function (titles, depict, linker, imgSrc) {
        if (need_jssdk) {
            this.jssdk.getSignPackage();
        }
        this.jssdk.init(titles, depict, linker, imgSrc);
    };
    __egretProto__.share_tap = function (self) {
        if (this.shareType == "weixin") {
            var share_Sprite = new egret.Sprite();
            self.addChild(share_Sprite);
            share_Sprite.x = 0;
            share_Sprite.y = 0;
            share_Sprite.width = self.stage.stageWidth;
            share_Sprite.height = self.stage.stageHeight;
            share_Sprite.graphics.beginFill(0x000000, 0.5);
            share_Sprite.graphics.drawRect(0, 0, self.stage.stageWidth, self.stage.stageHeight);
            share_Sprite.graphics.endFill();
            var share = new egret.Bitmap();
            share.texture = RES.getRes("share");
            share.x = 0;
            share.y = 0;
            share.height *= self.stage.stageWidth / share.measuredWidth;
            share.width = self.stage.stageWidth;
            share_Sprite.addChild(share);
            share_Sprite.touchEnabled = true;
            share_Sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                share_Sprite.touchEnabled = false;
                self.removeChild(share_Sprite);
            }, this);
        }
        else {
            alert("微信外 处理逻辑部分");
        }
    };
    return WeiXinShare;
})(egret.DisplayObjectContainer);
WeiXinShare.prototype.__class__ = "WeiXinShare";
var JSSDK = (function (_super) {
    __extends(JSSDK, _super);
    function JSSDK() {
        _super.apply(this, arguments);
        this.CLASS_NAME = "JSSDK";
    }
    var __egretProto__ = JSSDK.prototype;
    __egretProto__.init = function (titles, depict, linker, imgSrc) {
        this.titles = titles ? titles : "";
        this.depict = depict ? depict : "";
        this.linker = linker ? linker : "";
        this.imgSrc = imgSrc ? imgSrc : "";
    };
    /**
     * 获取签名分享
     */
    __egretProto__.getSignPackage = function () {
        var _this = this;
        if (need_jssdk) {
            this.url = "http://weixin.doupu.cn/json.php?url=" + location.href.split("#")[0];
            var urlloader = new egret.URLLoader();
            var req = new egret.URLRequest(this.url);
            urlloader.load(req);
            req.method = egret.URLRequestMethod.GET;
            urlloader.addEventListener(egret.Event.COMPLETE, function (e) {
                _this.signPackage = JSON.parse(e.target.data);
                _this.getWeiXinConfig();
                _this.getWeiXinShareTimeline(); //分享朋友圈
                _this.getWeiXinShareAppMessage(); //分享朋友
                _this.getWeiXinShareQQ(); //分享QQ
                _this.getWeiXinShareWeiBo(); //分享到腾讯微博
            }, this);
            need_jssdk = false;
        }
    };
    __egretProto__.getWeiXinConfig = function () {
        var bodyConfig = new BodyConfig();
        bodyConfig.debug = debug_type; // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        bodyConfig.appId = this.signPackage.appId; // 必填，公众号的唯一标识
        bodyConfig.timestamp = this.signPackage.timestamp; // 必填，生成签名的时间戳
        bodyConfig.nonceStr = this.signPackage.nonceStr; // 必填，生成签名的随机串
        bodyConfig.signature = this.signPackage.signature; // 必填，签名，见附录1
        bodyConfig.jsApiList = [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'chooseWXPay',
        ];
        wx.config(bodyConfig);
    };
    /**
     * 获取微信分享到朋友圈
     */
    __egretProto__.getWeiXinShareTimeline = function () {
        var _this = this;
        var bodyMenuShareTimeline = new BodyMenuShareTimeline();
        bodyMenuShareTimeline.trigger = function () {
            bodyMenuShareTimeline.title = _this.titles;
            bodyMenuShareTimeline.link = _this.linker;
            bodyMenuShareTimeline.imgUrl = _this.imgSrc;
            //alert('用户点击分享到朋友圈');
        };
        bodyMenuShareTimeline.success = function () {
            alert('已分享');
        };
        bodyMenuShareTimeline.cancel = function () {
            //alert('已取消');
        };
        bodyMenuShareTimeline.fail = function (res) {
            alert(JSON.stringify(res));
        };
        wx.onMenuShareTimeline(bodyMenuShareTimeline);
        //alert('已注册获取“分享到朋友圈”状态事件');
    };
    /**
     * 获取微信分享到朋友
     */
    __egretProto__.getWeiXinShareAppMessage = function () {
        var _this = this;
        var bodyMenuShareAppMessage = new BodyMenuShareAppMessage();
        bodyMenuShareAppMessage.trigger = function () {
            bodyMenuShareAppMessage.title = _this.titles;
            bodyMenuShareAppMessage.desc = _this.depict;
            bodyMenuShareAppMessage.link = _this.linker;
            bodyMenuShareAppMessage.imgUrl = _this.imgSrc;
            //alert('用户点击发送给朋友');
        };
        bodyMenuShareAppMessage.success = function () {
            alert('已分享');
        };
        bodyMenuShareAppMessage.cancel = function () {
            //alert('已取消');
        };
        bodyMenuShareAppMessage.fail = function (res) {
            alert(JSON.stringify(res));
        };
        wx.onMenuShareAppMessage(bodyMenuShareAppMessage);
        //alert('已注册获取“发送给朋友”状态事件');
    };
    /**
     * 获取微信分享到QQ
     */
    __egretProto__.getWeiXinShareQQ = function () {
        var _this = this;
        var bodyMenuShareQQ = new BodyMenuShareQQ();
        bodyMenuShareQQ.trigger = function () {
            bodyMenuShareQQ.title = _this.titles;
            bodyMenuShareQQ.desc = _this.depict;
            bodyMenuShareQQ.link = _this.linker;
            bodyMenuShareQQ.imgUrl = _this.imgSrc;
            //alert('用户点击分享到QQ');
        };
        bodyMenuShareQQ.complete = function (res) {
            alert(JSON.stringify(res));
        };
        bodyMenuShareQQ.success = function () {
            alert('已分享');
        };
        bodyMenuShareQQ.cancel = function () {
            //alert('已取消');
        };
        bodyMenuShareQQ.fail = function (res) {
            alert(JSON.stringify(res));
        };
        wx.onMenuShareQQ(bodyMenuShareQQ);
        //alert('已注册获取“分享到QQ”状态事件');
    };
    /**
     * 获取微信分享到腾讯微博
     */
    __egretProto__.getWeiXinShareWeiBo = function () {
        var _this = this;
        var bodyMenuShareWeibo = new BodyMenuShareWeibo();
        bodyMenuShareWeibo.trigger = function () {
            bodyMenuShareWeibo.title = _this.titles;
            bodyMenuShareWeibo.desc = _this.depict;
            bodyMenuShareWeibo.link = _this.linker;
            bodyMenuShareWeibo.imgUrl = _this.imgSrc;
            //alert('用户点击分享到微博');
        };
        bodyMenuShareWeibo.complete = function (res) {
            alert(JSON.stringify(res));
        };
        bodyMenuShareWeibo.success = function () {
            alert('已分享');
        };
        bodyMenuShareWeibo.cancel = function () {
            //alert('已取消');
        };
        bodyMenuShareWeibo.fail = function (res) {
            alert(JSON.stringify(res));
        };
        wx.onMenuShareWeibo(bodyMenuShareWeibo);
        //alert('已注册获取“分享到微博”状态事件');
    };
    __egretProto__.getchooseWXPay = function () {
        //var bodyMenuShareWeibo = new chooseWXPay();
        //alert('已注册获取“分享到微博”状态事件');
    };
    return JSSDK;
})(egret.DisplayObjectContainer);
JSSDK.prototype.__class__ = "JSSDK";
