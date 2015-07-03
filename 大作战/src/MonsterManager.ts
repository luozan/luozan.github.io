/**
 * Created by Administrator on 2015/4/28.
 */
class MonsterManager extends egret.DisplayObjectContainer{

    private gameScene:GameScene = null;
    private fightList = [];
    private timer:any = null;
    private place = function(){
        this.defender = [];
        this.attacker = [];
        this.place = null;
        this.CD = 0;
    }
    private isRunAI = false;
    public constructor(){
        super();
    }

    //创建计时器
    public createTimer():void{
        var timer = new egret.Timer(1000,0);
        timer.addEventListener(egret.TimerEvent.TIMER,this.updatePeople,this);
        timer.start();
        this.timer = timer;
    }
    public stopTimer():void{
        this.timer.stop();
    }
    private updatePeople():void{
        for(var i = 0;i < this.gameScene.base.length;i++){
            var item = this.gameScene.base[i];
            if(item.type == 'player' || item.type == 'computer'){
                item.number += item.speed;
                var difference;
                var arr;
                if(item.type == 'player'){
                    arr = item.playerBase;
                    difference = item.number - item.playerBase.length;
                }
                else{
                    arr = item.computerBase;
                    difference = item.number - item.computerBase.length;
                }
                difference = Math.floor(difference);
                if(item.type == 'player'){
                    this.gameScene.playerTotal += difference
                }
                else{
                    this.gameScene.computerTotal += difference
                }
                for(var s = 0;s < difference;s++){
                    var shap = this.gameScene.createSmallCircle(item.color,item.x,item.y,item.radius);
                    arr.push(shap);
                }
            }
            item.parent.getChildAt(1).text = ''+Math.floor(item.number);
        }
    }

    //private fight():void{
    //    for(var i = 0;i < this.gameScene.base.length;i++){
    //        var item = this.gameScene.base[i];
    //        if(item.playerBase.length > 0 && item.computerBase.length > 0){
    //            if(item.isFighting){
    //                //var playerPower = item.playerBase.length * 0.02;
    //                //var computerPower = item.computerBase.length * 0.02;
    //                //var integer = Math.floor(playerPower);
    //                //for(var s = 0; s < integer && item.computerBase.length > 0;s++){
    //                //    var round = item.computerBase.shift();
    //                //    round.parent.removeChild(round);
    //                //}
    //                //integer = Math.floor(computerPower);
    //                //for(var s = 0; s < integer && item.playerBase.length > 0;s++){
    //                //    var round = item.playerBase.shift();
    //                //    round.parent.removeChild(round);
    //                //}
    //            }
    //        }
    //    }
    //}
    private fight(){
        var i = 0;
        if(this.isRunAI){
            this.AI();
        }
        while(i < this.fightList.length){
            var item = this.fightList[i];
            var place = item.place;
            var y = item.defender.length;
            var x = item.attacker.length;
            //计算战斗伤害
            if(y > 0 && x > 0){
                var k = Math.min(y,x)/Math.max(y,x);
                var k1 = Math.max(y,x)/Math.min(y,x)
                var b = y-k*x;
                var v  = x/Math.floor(Math.random()*100+700)*k1;
                item.CD += v;9
                var x1 = Math.floor(item.CD);
                item.CD -= x1;
                var y1 = y - (k*(x-x1)+b);
                var at = 0;
                var de = 0;
                for(var s = 0;s < x1 && item.attacker.length > 0;s++){
                    var round = item.attacker.pop();
                    round.parent.removeChild(round);
                }
                at = s;
                for(var s = 0;s < y1 && item.defender.length > 0;s++){
                    var round = item.defender.pop();
                    round.parent.removeChild(round);
                }
                de = s;
                place.number -= s;
                if(place.type == 'player'){
                    this.gameScene.playerTotal -= de;
                    this.gameScene.computerTotal -= at;
                }
                else if(place.type == 'computer'){
                    this.gameScene.playerTotal -= at;
                    this.gameScene.computerTotal -= de;
                }
                else{
                    if(item.attackerType == 'player'){
                        this.gameScene.playerTotal -= at;
                    }
                    else{
                        this.gameScene.computerTotal -= at;
                    }
                }
            }
            //计算双方比例
            var total = item.defender.length + item.attacker.length;
            var percent = item.attacker.length/total;
            place.bar.setPercent(percent);
            if(item.attacker.length <= 0){
                if(place.type == 'player'){
                    console.log('玩家守住了电脑的进攻');
                }
                else{
                    console.log('电脑守住了玩家的进攻');
                }
                this.fightList.splice(i,1);
                if(place.bar.parent){
                    place.bar.parent.removeChild(place.bar);
                }
                place.isFighting = false;
            }
            else if(item.defender.length <= 0){
                if(item.attackerType == 'player'){
                    if(place.type == 'computer'){
                        console.log('电脑被玩家占领');
                        place.type = 'player';
                        place.color = this.gameScene.playerColor;
                    }
                    else{
                        console.log('中立被玩家占领');
                        place.type = 'player';
                        place.color = this.gameScene.playerColor;
                    }
                }
                else{
                    if(place.type == 'player'){
                        console.log('玩家基地被电脑占领')
                        place.type = 'computer';
                        place.color = this.gameScene.computerColor;
                    }
                    else{
                        console.log('中立基地被电脑占领')
                        place.type = 'computer';
                        place.color = this.gameScene.computerColor;
                        if(place.computerBase.length > 0){
                            this.gameScene.startFight(place);
                        }
                    }
                }
                this.fightList.splice(i,1);
                place.number = item.attacker.length;
                place.graphics.lineStyle(2,0x666666,1);
                place.graphics.beginFill(place.color,1);
                var r = place.radius;
                place.graphics.drawCircle(r,r,r);
                place.graphics.endFill();
                if(place.bar.parent){
                    place.bar.parent.removeChild(place.bar);
                }
                place.isFighting = false;
                place.parent.getChildAt(1).visible = true;
            }
            else{
                i++
            }
            place.parent.getChildAt(1).text = ''+Math.floor(place.number);
            if(this.gameScene.playerTotal <= 0){
                console.log('失败');
                egret.Tween.get(this).to({alpha:0},500,egret.Ease.sineIn).call(function(){
                    this.gameScene.stage.addChild(new LoseScene(this.gameScene.levelID));
                    this.gameScene.parent.removeChild(this.gameScene);
                });
                this.stopTimer();
                this.stopCheckFight();
            }
            else if(this.gameScene.computerTotal <= 0){
                console.log('成功');
                var time = new Date().getTime();
                egret.Tween.get(this).to({alpha:0},500).call(function(){
                    var sum = time - this.gameScene.startTime;
                    this.gameScene.stage.addChild(new WinScene(this.gameScene.levelID,sum));
                    this.gameScene.parent.removeChild(this.gameScene);
                });
                this.stopTimer();
                this.stopCheckFight();
            }
        }
    }

    public addFight(attackerType,place){
        var fight:any = new this.place();
        if(attackerType == 'player'){
            if(place.type == 'computer'){
                fight.defender = place.computerBase;
                fight.attacker = place.playerBase;
            }
            else{
                fight.defender = place.neutralBase;
                fight.attacker = place.playerBase;
            }
        }
        else{
            if(place.type == 'player'){
                fight.defender = place.playerBase;
                fight.attacker = place.computerBase;
            }
            else{
                fight.defender = place.neutralBase;
                fight.attacker = place.computerBase;
            }
        }
        fight.place = place;
        fight.attackerType = attackerType;
        this.fightList.push(fight);
    }

    public startCheckFight():void{
        this.addEventListener(egret.Event.ENTER_FRAME,this.fight,this);
    }
    public stopCheckFight():void{
        this.removeEventListener(egret.Event.ENTER_FRAME,this.fight,this);
    }

    //移动
    private moveTo(start,end){
        var startBase = start.computerBase;
        var offset = (start.radius-end.radius);
        var distance = Math.sqrt((end.x-start.x)*(end.x-start.x)+(end.y-start.y)*(end.y-start.y));
        for(var i = 0;i < startBase.length;){
            if(startBase[i].isMove){
                i++;
                continue;
            }
            //egret.Tween.removeTweens(arr[1]);
            startBase[i].isMove = true;
            if(start.type == 'computer'){
                start.number--;
            }
            egret.Tween.get(startBase[i],{},{},true).to({anchorOffsetX:0,anchorOffsetY:0,x:end.x,y:end.y},distance*(2+Math.random())).call(this.rotate,this,[startBase[i],offset,end]);
            start.computerBase.splice(i,1);
        }
        start.parent.getChildAt(1).text = Math.floor(start.number)+'';
        end.parent.getChildAt(1).text = Math.floor(end.number)+'';
    }
    private rotate(object,offset,end){
        if(object.anchor.x < 0){
            object.anchor.x += offset;
        }
        else{
            object.anchor.x -= offset;
        }
        if(object.anchor.y < 0){
            object.anchor.y += offset;
        }
        else{
            object.anchor.y -= offset;
        }
        var self = this;
        egret.Tween.get(object,{},{},true).to({anchorOffsetX:object.anchor.x,anchorOffsetY:object.anchor.y,rotation:0},500).call(function(){
            object.isMove = false;
            end.computerBase.push(object);
            if(end.type == 'computer'){
                end.number++;
                end.parent.getChildAt(1).text = Math.floor(end.number)+'';
            }
            if(!end.isFighting && end.type != 'computer'){
                self.startFight(end);
            }
            egret.Tween.get(object,{loop:true},{},true).to({rotation:360},Math.random()*5000+3000);
        });
    }
    private startFight(end):void{
        end.isFighting = true;
        var bar = new Bar(this.gameScene.computerColor,end);
        this.gameScene.addChild(bar);
        if(end.type == 'neutral'){
            console.log('asdasdasd');
            bar.visible = false;
        }
        end.bar = bar;
        this.addFight('computer',end);
    }

    //AI
    private AI(){
        var computerBase = [];
        var playerBase = [];
        var neutralBase = [];
        var length = this.gameScene.base.length;
        for(var i = 0;i < length;i++){
            var item = this.gameScene.base[i];
            switch (item.type){
                case 'player':{
                    playerBase.push(item);
                }
                    break;
                case 'computer':{
                    computerBase.push(item);
                }
                    break;
                case 'neutral':{
                    neutralBase.push(item);
                }
                    break;
            }
        }
        //执行逻辑
        for(var i = 0;i < computerBase.length;i++){
            var item = computerBase[i];
            if(item.isFighting){
                continue;
            }
            var number = item.computerBase.length;
            var random = Math.random()*1000;
            if(random<45||50<random){
                continue;
            }
            var arr = [];
            //计算人数
            for(var j = 0;j < computerBase.length;j++){
                if(j == i){
                    continue;
                }
                var obj:any = {};
                obj.j = j;
                obj.value = item.computerBase.length + computerBase[j].computerBase.length;
                arr.push(obj);
            }
            //排序
            arr.sort(this.compare);
            //占领中立
            for(var n = 0;n < neutralBase.length;n++){
                if(neutralBase[n].isFighting){
                    continue;
                }
                var neutralNumber = neutralBase[n].neutralBase.length;
                if(neutralNumber >= number){
                    for(var j = 0; j < arr.length;j++){
                        var obj = arr[j];
                        if(obj.value > neutralNumber){
                            this.moveTo(item,neutralBase[n]);
                            this.moveTo(computerBase[obj.j],neutralBase[n]);
                            obj.value = 0;
                            arr = [];
                        }
                    }
                    continue;
                }
                this.moveTo(item,neutralBase[n]);
            }
            //攻击玩家
            if(neutralBase.length == 0){
                for(var p = 0;p < playerBase.length;p++){
                    var player = playerBase[p];
                    if(player.isFighting == true && player.computerBase.length <= player.playerBase.length){
                        this.moveTo(item,player);
                    }
                    else if(player.isFighting == false && number > player.playerBase.length){
                        this.moveTo(item,player);
                    }
                    else if(player.isFighting == false && number <= player.playerBase.length){
                        for(var j = 0; j < arr.length;j++){
                            var obj = arr[j];
                            if(obj.value > neutralNumber){
                                this.moveTo(item,player);
                                this.moveTo(computerBase[obj.j],player);
                                obj.value = 0;
                                arr = [];
                            }
                        }
                    }
                }
            }
            //支援己方
            for(var c = 0;c < computerBase.length;c++){
                var computer = computerBase[c];
                if(computer.isFighting == true && computer.computerBase.length <= computer.playerBase.length){
                    this.moveTo(item,computer);
                }
            }
        }
    }
    public runAI(){
        var self = this;
        setTimeout(function(){
            self.isRunAI = true;
        },5000);
    }
    //排序函数
    private compare(a:any,b:any):number{
        return a.value - b.value;
    }
}