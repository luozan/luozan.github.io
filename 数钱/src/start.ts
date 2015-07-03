/**
 * Created by Administrator on 2015/5/13.
 */
class start extends egret.DisplayObjectContainer{

    public constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
    }

    private addToStage(){
        var splashtitle = new egret.Bitmap();
        splashtitle.texture = RES.getRes('splashtitle_png');
        this.addChild(splashtitle);
        var money:any = new egret.Bitmap();
        money.texture = RES.getRes('mb0_png');
        money.anchorX = 0.5;
        money.x = this.stage.stageWidth/2;
        money.y = this.stage.stageHeight-money.height/3-50;
        console.log(money.y);
        money.touchEnabled = true;
        money.isDown = false;
        money.startOffset = 0;
        money.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(event:any){
            money.isDown = true;
            money.startOffset = event.stageY;
            console.log(event);
        },this);
        money.addEventListener(egret.TouchEvent.TOUCH_MOVE,function(event:any){
            if(money.isDown){
                var offset = event.stageY - money.startOffset;
                console.log(offset);
                money.startOffset = event.stageY;
                if(money.y >= 652 && offset > 0){
                    return;
                }
                if(money.y+offset > 652){
                    money.y = 652;
                    return;
                }
                money.y += offset;
            }
        },this);
        var self = this;
        money.addEventListener(egret.TouchEvent.TOUCH_END,function(event:any){
            money.isDown = false;
            egret.Tween.get(money).to({y:money.y-1200},250).call(function(){
                self.stage.addChild(new game());
                self.parent.removeChild(self);
            });
        },this);
        money.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,function(event:any){
            money.isDown = false;
            egret.Tween.get(money).to({y:money.y-1200},250).call(function(){
                self.stage.addChild(new game());
                self.parent.removeChild(self);
            });
        },this);
        this.addChild(money);
        var starttip = new egret.Bitmap();
        starttip.texture = RES.getRes('starttip_png');
        starttip.anchorX = 0.5;
        starttip.anchorY = 0.5;
        starttip.x = this.stage.stageWidth/2;
        starttip.y = this.stage.stageHeight/2+50;
        this.addChild(starttip);
        console.log('adsasd');
    }

}