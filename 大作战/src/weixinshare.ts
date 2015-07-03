
interface SignPackage {
    appId:string;
    nonceStr:string;
    timestamp:number;
    signature:string;
    url:string;
}
var need_jssdk=true;
/////////////////////////////////////////////////
var debug_type=false;    //调试模式
/////////////////////////////////////////////
class WeiXinShare extends egret.DisplayObjectContainer {
    public shareType="outside";//浏览位置 微信外
    //public shareType="weixin";//浏览位置 微信内
    public  jssdk=new JSSDK();
    public constructor() {
        super();
        if( navigator.userAgent.toLowerCase().toString().indexOf("micromessenger")>0) {
            this.shareType="weixin";
        }
    }
    public createShareButton(x,y,size,self): void {
        if(this.shareType=="weixin") {
            var sharebtn = new egret.Bitmap();
            sharebtn.texture = RES.getRes("sharebtn");

            sharebtn.name = "sharebtn";
            sharebtn.width = size;
            sharebtn.height *= size / sharebtn.measuredWidth;
            sharebtn.anchorX=0.5;
            sharebtn.anchorY=0.5;
            sharebtn.x = x+size/2;
            sharebtn.y = y+sharebtn.height/2;
            self.addChild(sharebtn);
            sharebtn.touchEnabled = true;
            sharebtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(){
                egret.Tween.get(sharebtn).to({"scaleX":0.8,"scaleY":0.8},100);
            },this);
            sharebtn.addEventListener(egret.TouchEvent.TOUCH_END,function(){
                egret.Tween.get(sharebtn).to({"scaleX":1,"scaleY":1},500);
            },this);
            sharebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                this.share_tap(self);
            }, this);
        }
    }
    public weiXinShareSet(titles,depict,linker,imgSrc){
        if(need_jssdk){
            this.jssdk.getSignPackage();
        }
        this.jssdk.init(titles,depict,linker,imgSrc);
    }
    public share_tap(self){
        if(this.shareType=="weixin"){//微信内分享处理部分
            var share_Sprite=new egret.Sprite();
            self.addChild(share_Sprite);
            share_Sprite.x=0;
            share_Sprite.y=0;
            share_Sprite.width=self.stage.stageWidth;
            share_Sprite.height=self.stage.stageHeight;
            share_Sprite.graphics.beginFill(0x000000,0.5);
            share_Sprite.graphics.drawRect(0,0,self.stage.stageWidth,self.stage.stageHeight);
            share_Sprite.graphics.endFill();
            var share=new egret.Bitmap();
            share.texture=RES.getRes("share");
            share.x=0;
            share.y=0;
            share.height*=self.stage.stageWidth/share.measuredWidth;
            share.width=self.stage.stageWidth;
            share_Sprite.addChild(share);
            share_Sprite.touchEnabled=true;
            share_Sprite.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
                share_Sprite.touchEnabled=false;
                self.removeChild(share_Sprite);
            },this);
        }else{
            alert("微信外 处理逻辑部分");
        }
    }
}


class JSSDK extends egret.DisplayObjectContainer {

    public CLASS_NAME:string = "JSSDK";
    private titles:string;
    private depict:string;
    private linker:string;
    private imgSrc:string;
    private signPackage:SignPackage;
    private url:string;

    public init(titles,depict,linker,imgSrc) {        //初始化分享内容
        this.titles = titles ? titles : "";
        this.depict = depict ? depict : "";
        this.linker = linker ? linker : "";
        this.imgSrc = imgSrc ? imgSrc : "";
    }

    /**
     * 获取签名分享
     */
    public getSignPackage() {
        if(need_jssdk){
            this.url = "http://weixin.doupu.cn/json.php?url="+location.href.split("#")[0];
            var urlloader = new egret.URLLoader();
            var req = new egret.URLRequest(this.url);
            urlloader.load(req);
            req.method = egret.URLRequestMethod.GET;
            urlloader.addEventListener(egret.Event.COMPLETE, (e)=> {
                this.signPackage = <SignPackage>JSON.parse(e.target.data);
                this.getWeiXinConfig();
                this.getWeiXinShareTimeline();//分享朋友圈
                this.getWeiXinShareAppMessage();//分享朋友
                this.getWeiXinShareQQ();//分享QQ
                this.getWeiXinShareWeiBo();//分享到腾讯微博
            }, this);
            need_jssdk=false;
        }
    }

    private getWeiXinConfig() {

        var bodyConfig = new BodyConfig();
        bodyConfig.debug = debug_type;// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        bodyConfig.appId = this.signPackage.appId;// 必填，公众号的唯一标识
        bodyConfig.timestamp = this.signPackage.timestamp;// 必填，生成签名的时间戳
        bodyConfig.nonceStr = this.signPackage.nonceStr;// 必填，生成签名的随机串
        bodyConfig.signature = this.signPackage.signature;// 必填，签名，见附录1
        bodyConfig.jsApiList = [// 必填，需要使用的JS接口列表，所有JS接口列表见附录
            'checkJsApi',//判断当前客户端是否支持指定JS接口
            'onMenuShareTimeline',//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            'onMenuShareAppMessage',//获取“分享给朋友”按钮点击状态及自定义分享内容接口
            'onMenuShareQQ',//获取“分享到QQ”按钮点击状态及自定义分享内容接口
            'onMenuShareWeibo',//获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
            'chooseWXPay',//发起一个微信支付请求
            //'hideMenuItems',//批量隐藏功能按钮接口
            //'showMenuItems',//批量显示功能按钮接口
            //'hideAllNonBaseMenuItem',//隐藏所有非基础按钮接口
            //'showAllNonBaseMenuItem',//显示所有功能按钮接口
            //'translateVoice',//识别音频并返回识别结果接口
            //'startRecord',//开始录音接口
            //'stopRecord',//停止录音接口
            //'playVoice',//播放语音接口
            //'pauseVoice',//暂停播放接口
            //'stopVoice',//停止播放接口
            //'uploadVoice',//上传语音接口
            //'downloadVoice',//下载语音接口
            //'chooseImage',//拍照或从手机相册中选图接口
            //'previewImage',//预览图片接口
            //'uploadImage',//上传图片接口
            //'downloadImage',//下载图片接口
            //'getNetworkType',//获取网络状态接口
            //'openLocation',//使用微信内置地图查看位置接口
            //'getLocation',//获取地理位置接口
            //'hideOptionMenu',//隐藏右上角菜单接口
            //'showOptionMenu',//显示右上角菜单接口
            //'closeWindow',//关闭当前网页窗口接口
            //'scanQRCode',//调起微信扫一扫接口
            //'openProductSpecificView',//跳转微信商品页接口
            //'addCard',//批量添加卡券接口
            //'chooseCard',//调起适用于门店的卡券列表并获取用户选择列表
            //'openCard'//查看微信卡包中的卡券接口
        ];
        wx.config(bodyConfig);
    }

    /**
     * 获取微信分享到朋友圈
     */
    public getWeiXinShareTimeline() {
            var bodyMenuShareTimeline = new BodyMenuShareTimeline();
            bodyMenuShareTimeline.trigger = ()=> {
                bodyMenuShareTimeline.title = this.titles;
                bodyMenuShareTimeline.link = this.linker;
                bodyMenuShareTimeline.imgUrl = this.imgSrc;
                //alert('用户点击分享到朋友圈');
            };
            bodyMenuShareTimeline.success = ()=> {
                alert('已分享');
            };
            bodyMenuShareTimeline.cancel = ()=> {
                //alert('已取消');
            };
            bodyMenuShareTimeline.fail = (res)=> {
                alert(JSON.stringify(res));
            };
            wx.onMenuShareTimeline(bodyMenuShareTimeline);
            //alert('已注册获取“分享到朋友圈”状态事件');
    }

    /**
     * 获取微信分享到朋友
     */
    public getWeiXinShareAppMessage(){
            var bodyMenuShareAppMessage = new BodyMenuShareAppMessage();
            bodyMenuShareAppMessage.trigger = ()=> {
                bodyMenuShareAppMessage.title = this.titles;
                bodyMenuShareAppMessage.desc = this.depict;
                bodyMenuShareAppMessage.link = this.linker;
                bodyMenuShareAppMessage.imgUrl = this.imgSrc;
                //alert('用户点击发送给朋友');
            };
            bodyMenuShareAppMessage.success = ()=> {
                alert('已分享');
            };
            bodyMenuShareAppMessage.cancel = ()=> {
                //alert('已取消');
            };
            bodyMenuShareAppMessage.fail = (res)=> {
                alert(JSON.stringify(res));
            };
            wx.onMenuShareAppMessage(bodyMenuShareAppMessage);
            //alert('已注册获取“发送给朋友”状态事件');
    }

    /**
     * 获取微信分享到QQ
     */
    public getWeiXinShareQQ(){
            var bodyMenuShareQQ = new BodyMenuShareQQ();
            bodyMenuShareQQ.trigger = ()=> {
                bodyMenuShareQQ.title = this.titles;
                bodyMenuShareQQ.desc = this.depict;
                bodyMenuShareQQ.link = this.linker;
                bodyMenuShareQQ.imgUrl = this.imgSrc;
                //alert('用户点击分享到QQ');
            };
            bodyMenuShareQQ.complete = (res)=> {
                alert(JSON.stringify(res));
            };
            bodyMenuShareQQ.success = ()=> {
                alert('已分享');
            };
            bodyMenuShareQQ.cancel = ()=> {
                //alert('已取消');
            };
            bodyMenuShareQQ.fail = (res)=> {
                alert(JSON.stringify(res));
            };
            wx.onMenuShareQQ(bodyMenuShareQQ);
            //alert('已注册获取“分享到QQ”状态事件');

    }

    /**
     * 获取微信分享到腾讯微博
     */
    public getWeiXinShareWeiBo(){
            var bodyMenuShareWeibo = new BodyMenuShareWeibo();
            bodyMenuShareWeibo.trigger = ()=> {
                bodyMenuShareWeibo.title = this.titles;
                bodyMenuShareWeibo.desc = this.depict;
                bodyMenuShareWeibo.link = this.linker;
                bodyMenuShareWeibo.imgUrl = this.imgSrc;
                //alert('用户点击分享到微博');
            };
            bodyMenuShareWeibo.complete = (res)=> {
                alert(JSON.stringify(res));
            };
            bodyMenuShareWeibo.success = ()=> {
                alert('已分享');
            };
            bodyMenuShareWeibo.cancel = ()=> {
                //alert('已取消');
            };
            bodyMenuShareWeibo.fail = (res)=> {
                alert(JSON.stringify(res));
            };
            wx.onMenuShareWeibo(bodyMenuShareWeibo);
            //alert('已注册获取“分享到微博”状态事件');

    }
    public getchooseWXPay(){
            //var bodyMenuShareWeibo = new chooseWXPay();

            //alert('已注册获取“分享到微博”状态事件');

    }

}
