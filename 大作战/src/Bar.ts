/**
 * Created by Administrator on 2015/4/21.
 */
class Bar extends egret.Sprite{

    private colorLeft = 0xFF0000;
    private colorRight = 0x00AAFF;
    private barLeft;

    public constructor(color,end){
        super();
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.x = end.x;
        this.y = end.y - end.radius - 50;
        this.width = end.radius*2+40;
        this.height = 20;
        this.colorLeft = color;
        console.log(color);
        this.colorRight = end.color;
        this.createBar();
    }

    private createBar():void {
        var barRight = new egret.Shape();
        barRight.graphics.lineStyle(2, 0x999999, 1);
        barRight.graphics.beginFill(this.colorRight, 1);
        barRight.graphics.drawRect(0, 0, this.width, this.height);
        barRight.graphics.endFill();
        this.addChild(barRight);
        var barLeft = new egret.Shape();
        barLeft.graphics.lineStyle(2, 0x999999, 1);
        barLeft.graphics.beginFill(this.colorLeft, 1);
        barLeft.graphics.drawRect(0, 0, this.width, this.height);
        barLeft.graphics.endFill();
        barLeft.mask = new egret.Rectangle(0,0,0,this.height+2);
        this.barLeft = barLeft;
        this.addChild(barLeft);
    }

    public setPercent(percent):void{
        this.barLeft.mask.width = percent*this.width;
    }

}