/**
 * Created by Administrator on 2015/4/20.
 */
var Sector = (function (_super) {
    __extends(Sector, _super);
    function Sector() {
        _super.call(this);
    }
    var __egretProto__ = Sector.prototype;
    __egretProto__.DrawSector = function (x, y, r, startFrom, angle, color) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (r === void 0) { r = 100; }
        if (startFrom === void 0) { startFrom = 0; }
        if (angle === void 0) { angle = 360; }
        if (color === void 0) { color = 0xff0000; }
        this.graphics.beginFill(color);
        //this.graphics.lineStyle(0, 0xff0000);
        this.graphics.moveTo(x, y);
        angle = (Math.abs(angle) > 360) ? 360 : angle;
        var n = Math.ceil(Math.abs(angle) / 45);
        var angleA = angle / n;
        angleA = angleA * Math.PI / 180;
        startFrom = startFrom * Math.PI / 180;
        this.graphics.lineTo(x + r * Math.cos(startFrom), y + r * Math.sin(startFrom));
        for (var i = 1; i <= n; i++) {
            startFrom += angleA;
            var angleMid = startFrom - angleA / 2;
            var bx = x + r / Math.cos(angleA / 2) * Math.cos(angleMid);
            var by = y + r / Math.cos(angleA / 2) * Math.sin(angleMid);
            var cx = x + r * Math.cos(startFrom);
            var cy = y + r * Math.sin(startFrom);
            this.graphics.curveTo(bx, by, cx, cy);
        }
        if (angle != 360) {
            this.graphics.lineTo(x, y);
        }
        this.graphics.endFill(); // if you want a sector without filling color , please remove this line.
    };
    return Sector;
})(egret.Shape);
Sector.prototype.__class__ = "Sector";
