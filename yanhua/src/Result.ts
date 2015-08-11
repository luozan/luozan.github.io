
interface SignPackage {
    appId:string;
    nonceStr:string;
    timestamp:number;
    signature:string;
    url:string;
}

class Result extends egret.DisplayObjectContainer {

    private signPackage:SignPackage;
    private url:string;
    private title:any;
    private desc:any;
    private link:any;
    private imgUrl:any;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        this.createGameScene();
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        this.init();
        var sky:egret.Bitmap = this.createBitmapByName("background");
        this.addChild(sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;


        var again = new egret.Bitmap();
        again.anchorX = 0.5;
        again.anchorY = 0.5;
        again.x = 345-140;
        again.y = 480;
        again.texture = RES.getRes('again');
        again.touchEnabled = true;
        var self = this;
        again.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            self.stage.addChild(new Main());
            self.stage.removeChild(self);
            window['clearBigBoom']();
            egret.clearInterval(window['currentInterval']);
        },this);
        again.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(){
            again.scaleX = 0.9;
            again.scaleY = 0.9;
        },this);
        again.addEventListener(egret.TouchEvent.TOUCH_END,function(){
            again.scaleX = 1;
            again.scaleY = 1;
        },this);
        again.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,function(){
            again.scaleX = 1;
            again.scaleY = 1;
        },this)
        this.addChild(again);

        var share = new egret.Bitmap();
        share.anchorX = 0.5;
        share.anchorY = 0.5;
        share.x = 345+140;
        share.y = 480;
        share.texture = RES.getRes('btn_share');
        share.touchEnabled = true;
        share.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            document.getElementById('share').style.display = 'block';
        },this)
        share.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(){
            share.scaleX = 0.9;
            share.scaleY = 0.9;
        },this);
        share.addEventListener(egret.TouchEvent.TOUCH_END,function(){
            share.scaleX = 1;
            share.scaleY = 1;
        },this);
        share.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,function(){
            share.scaleX = 1;
            share.scaleY = 1;
        },this)
        this.addChild(share);

        var more = new egret.Bitmap();
        more.texture = RES.getRes('more');
        more.anchorX = 0.5;
        more.anchorY = 0.5;
        more.x = 345;
        more.y = 560;
        more.touchEnabled = true;
        more.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            location.href = 'http://mp.weixin.qq.com/s?__biz=MzA4ODA2NzUxNg==&mid=209345506&idx=4&sn=00045e860da1453df142c2bb43acdca2#rd';
        },this)
        more.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(){
            more.scaleX = 0.9;
            more.scaleY = 0.9;
        },this);
        more.addEventListener(egret.TouchEvent.TOUCH_END,function(){
            more.scaleX = 1;
            more.scaleY = 1;
        },this);
        more.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,function(){
            more.scaleX = 1;
            more.scaleY = 1;
        },this)
        this.addChild(more);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 初始化
     **/
    public init() {
        // //定义皮肤
        // this.skinName = "skins.jssdk.ShareSkin";

        //初始化分享内容
        this.title.text = this.title.text ? this.title.text : "燃放烟火，为中国喝彩！";
        this.desc.text = this.desc.text ? this.desc.text : ""
        this.link.text = this.link.text ? this.link.text : location.href;
        this.imgUrl.text = this.imgUrl.text ? this.imgUrl.text : location.href+"/icon.png";

        //你的后端数据JSON入口
        //this.url = "你的后端数据入口，自行配置JSON串，后端语言不限，可以参照PHP/NET程序";
        this.url = location.href+"/php/json.php?url=" + location.href.split("#")[0];

        //获取签名
        this.getSignPackage();
    }

    /**
     * 获取签名分享
     */
    private getSignPackage() {
        var urlloader = new egret.URLLoader();
        var req = new egret.URLRequest(this.url);
        urlloader.load(req);
        req.method = egret.URLRequestMethod.GET;
        urlloader.addEventListener(egret.Event.COMPLETE, (e)=> {
            this.signPackage = <SignPackage>JSON.parse(e.target.data);
            //........................................................
            //基本配置
            this.getWeiXinConfig();
            //下面可以加更多接口,可自行扩展
            this.getWeiXinShareTimeline();//分享朋友圈
            this.getWeiXinShareAppMessage();//分享朋友
            //........................................................
        }, this);
    }

    /**
     * 获取微信配置
     */
    private getWeiXinConfig() {
        /*
         * 注意：
         * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
         * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
         * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
         *
         * 如有问题请通过以下渠道反馈：
         * 邮箱地址：weixin-open@qq.com
         * 邮件主题：【微信JS-SDK反馈】具体问题
         * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
         */
        //配置参数
        var bodyConfig = new BodyConfig();
        bodyConfig.debug = true;// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        bodyConfig.appId = this.signPackage.appId;// 必填，公众号的唯一标识
        bodyConfig.timestamp = this.signPackage.timestamp;// 必填，生成签名的时间戳
        bodyConfig.nonceStr = this.signPackage.nonceStr;// 必填，生成签名的随机串
        bodyConfig.signature = this.signPackage.signature;// 必填，签名，见附录1
        bodyConfig.jsApiList = [// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            // 所有要调用的 API 都要加到这个列表中
            'checkJsApi',//判断当前客户端是否支持指定JS接口
            'onMenuShareTimeline',//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            'onMenuShareAppMessage',//获取“分享给朋友”按钮点击状态及自定义分享内容接口
            'onMenuShareQQ',//获取“分享到QQ”按钮点击状态及自定义分享内容接口
            'onMenuShareWeibo',//获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
            'hideMenuItems',//批量隐藏功能按钮接口
            'showMenuItems',//批量显示功能按钮接口
            'hideAllNonBaseMenuItem',//隐藏所有非基础按钮接口
            'showAllNonBaseMenuItem',//显示所有功能按钮接口
            'translateVoice',//识别音频并返回识别结果接口
        ];
        wx.config(bodyConfig);
    }

    /**
     * 获取微信分享到朋友圈
     */
    private getWeiXinShareTimeline() {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, (e)=> {
            var bodyMenuShareTimeline = new BodyMenuShareTimeline();
            bodyMenuShareTimeline.title = this.title.text;
            bodyMenuShareTimeline.link = this.link.text;
            bodyMenuShareTimeline.imgUrl = this.imgUrl.text;
            bodyMenuShareTimeline.trigger = ()=> {
                alert('用户点击分享到朋友圈');
            };
            bodyMenuShareTimeline.success = ()=> {
                alert('已分享');
            };
            bodyMenuShareTimeline.cancel = ()=> {
                alert('已取消');
            };
            bodyMenuShareTimeline.fail = (res)=> {
                alert(JSON.stringify(res));
            };
            wx.onMenuShareTimeline(bodyMenuShareTimeline);
            alert('已注册获取“分享到朋友圈”状态事件');
        }, this);
    }

    /**
     * 获取微信分享到朋友
     */
    private getWeiXinShareAppMessage(){
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, (e)=> {
            var bodyMenuShareAppMessage = new BodyMenuShareAppMessage();
            bodyMenuShareAppMessage.title = this.title.text;
            bodyMenuShareAppMessage.desc = this.desc.text;
            bodyMenuShareAppMessage.link = this.link.text;
            bodyMenuShareAppMessage.imgUrl = this.imgUrl.text;
            bodyMenuShareAppMessage.trigger = ()=> {
                alert('用户点击发送给朋友');
            };
            bodyMenuShareAppMessage.success = ()=> {
                alert('已分享');
            };
            bodyMenuShareAppMessage.cancel = ()=> {
                alert('已取消');
            };
            bodyMenuShareAppMessage.fail = (res)=> {
                alert(JSON.stringify(res));
            };
            wx.onMenuShareAppMessage(bodyMenuShareAppMessage);
            alert('已注册获取“发送给朋友”状态事件');
        }, this);
    }
}
