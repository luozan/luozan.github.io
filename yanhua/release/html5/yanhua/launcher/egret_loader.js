//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

egret_h5.startGame = function () {
    var context = egret.MainContext.instance;
    context.touchContext = new egret.HTML5TouchContext();
    context.deviceContext = new egret.HTML5DeviceContext();
    context.netContext = new egret.HTML5NetContext();

    egret.StageDelegate.getInstance().setDesignSize(690, 1010);
    var stage = new egret.Stage();
    var scaleMode = egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE ? egret.StageScaleMode.SHOW_ALL : egret.StageScaleMode.SHOW_ALL;
    //egret.StageScaleMode.NO_SCALE
    stage.scaleMode = scaleMode;
    stage.frameRate = 30;
    context.stage = stage;

    //WebGL is a Egret's beta property. It's off by default.
    //WebGL是egret的Beta特性，默认关闭
    var rendererType = 0;
    if (rendererType == 1) {// egret.WebGLUtils.checkCanUseWebGL()) {
        console.log("Use WebGL mode");
        context.rendererContext = new egret.WebGLRenderer();
    }
    else {
        context.rendererContext = new egret.HTML5CanvasRenderer();
    }

    egret.MainContext.instance.rendererContext.texture_scale_factor = 1;
    context.run();

    var rootClass;
    if (document_class) {
        rootClass = egret.getDefinitionByName(document_class);
    }
    if (rootClass) {
        var rootContainer = new rootClass();
        if (rootContainer instanceof egret.DisplayObjectContainer) {
            context.stage.addChild(rootContainer);
        }
        else {
            throw new Error("Document Class must be the subclass to egret.DisplayObjectContainer!");
        }
    }
    else {
        throw new Error("Document Class is not found！");
    }

    //处理屏幕大小改变
    //implement for screen size change
    var resizeTimer = null;
    var doResize = function () {
        context.stage.changeSize();
        resizeTimer = null;
    };
    window.onresize = function () {
        if (resizeTimer == null) {
            resizeTimer = setTimeout(doResize, 300);
        }
    };




var canvas = context.rendererContext.canvas;
        var ocas = context.rendererContext._cacheCanvas;
        var octx = context.rendererContext._cacheCanvasContext;
        var ctx = context.rendererContext.canvasContext;
        var bigbooms = [];
    
        window.onload = function(){
            initAnimate()
        }

        function initAnimate(){
            drawBg();

            lastTime = new Date();
            //animate();
        }

        var lastTime;
        function animate(){
            // ctx.save();
            // ctx.fillStyle = "rgba(0,5,24,0.1)";
            // ctx.fillRect(0,0,canvas.width,canvas.height);
            // ctx.restore();


            var newTime = new Date();
            if(newTime-lastTime>500+(window.innerHeight-767)/2){
                var random = Math.random()*100>2?true:false;
                var x = getRandom(canvas.width/5 , canvas.width*4/5);
                var y = getRandom(50 , 200);
                //if(random){
                // var bigboom = new Boom(getRandom(canvas.width/3,canvas.width*2/3) ,2,"#FFF" , {x:x , y:y});
                // bigbooms.push(bigboom)
                //}
                //else {
                // var bigboom = new Boom(getRandom(canvas.width/3,canvas.width*2/3) ,2,"#FFF" , {x:canvas.width/2 , y:200} , document.querySelectorAll(".shape")[parseInt(getRandom(0, document.querySelectorAll(".shape").length))]);
                // bigbooms.push(bigboom)
                //}
                //var bigboom = new Boom(240,2,"#FFF" , {x:240 , y:200});
                // var bigboom = new Boom(240 ,2,"#FFF" , {x:canvas.width/2 , y:200} , document.querySelectorAll(".shape")[parseInt(getRandom(0, document.querySelectorAll(".shape").length))]);
                // console.log(document.querySelectorAll(".shape")[parseInt(getRandom(0, document.querySelectorAll(".shape").length))]);
                //bigbooms.push(bigboom)
                lastTime = newTime;
            }

            stars.foreach(function(){
                this.paint();
            })

            bigbooms.foreach(function(index){
                var that = this;
                if(!this.dead){
                    this._move();
                    this._drawLight();
                }
                else{
                    this.booms.foreach(function(index){
                        if(that.shape){
                            var i =Math.round(Math.random()*4);
                            var obj = window['allYanhua'][i];
                            obj.y = that.y+200;
                            window['yanhuatween'](obj);
                            bigbooms[bigbooms.indexOf(that)] = null;
                            that.shape = false;
                        }
                        if(!this.dead) {
                            this.moveTo(index);
                        }
                        else if(index === that.booms.length-1){
                            //if(that.shape&&window.mainscene){
                            //    window.mainscene.stage.addChild(new ResultScene());
                            //    window.mainscene.stage.removeChild(window.mainscene);
                            //}
                            bigbooms[bigbooms.indexOf(that)] = null;
                        }
                    })
                }
            });
            
            //raf(animate);
        }
        window.animate = animate;
        Array.prototype.foreach = function(callback){
            for(var i=0;i<this.length;i++){
                if(this[i]!==null) callback.apply(this[i] , [i])
            }
        }

        var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
        
        window.makeBigBoom = function(x,y,x2){
            var bigboom = new Boom(x2 ,3,"#FFF" , {x:x , y:y});
            bigbooms.push(bigboom)
        }

        window.makeText = function(x,y,x2){
            var bigboom = new Boom(x2 ,3,"#FFF" , {x:x , y:y} , document.querySelectorAll(".shape")[parseInt(getRandom(0, document.querySelectorAll(".shape").length))]);
            bigbooms.push(bigboom)
        }

        window.clearBigBoom = function(){
            bigbooms = [];
        }
        // canvas.addEventLisener("touchstart" , function(event){
        //  var touch = event.targetTouches[0];
        //  var x = event.pageX;
        //  var y = event.pageY;
        //  var bigboom = new Boom(getRandom(canvas.width/3,canvas.width*2/3) ,2,"#FFF" , {x:x , y:y});
        //  bigbooms.push(bigboom)
        // })

        var Boom = function(x,r,c,boomArea,shape){
            this.booms = [];
            this.x = x;
            this.y = 830;
            this.r = r;
            this.c = c;
            this.shape = shape || false;
            this.boomArea = boomArea;
            this.theta = 0;
            this.dead = false;
            this.ba = parseInt(getRandom(80 , 200));
        }
        Boom.prototype = {
            _paint:function(){
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
                ctx.fillStyle = this.c;
                ctx.fill();
                ctx.restore();
            },
            _move:function(){
                var dx = this.boomArea.x - this.x , dy = this.boomArea.y - this.y;
                this.x = this.x+dx*0.05;
                this.y = this.y+dy*0.05;

                if(Math.abs(dx)<=this.ba && Math.abs(dy)<=this.ba){
                    if(this.shape){
                        this._shapBoom();
                    }
                    else this._boom();
                    this.dead = true;
                }
                else {
                    this._paint();
                }
            },
            _drawLight:function(){
                ctx.save();
                ctx.fillStyle = "rgba(255,228,150,0.3)";
                ctx.beginPath();
                ctx.arc(this.x , this.y , this.r+3*Math.random()+1 , 0 , 2*Math.PI);
                ctx.fill();
                ctx.restore();
            },
            _boom:function(){
                var fragNum = getRandom(30 , 200);
                var style = getRandom(0,10)>=5? 1 : 2;
                var color;
                if(style===1){
                    color = {
                        a:parseInt(getRandom(128,255)),
                        b:parseInt(getRandom(128,255)),
                        c:parseInt(getRandom(128,255))
                    }
                }

                var fanwei = parseInt(getRandom(300, 400));
                for(var i=0;i<fragNum;i++){
                    if(style===2){
                        color = {
                            a:parseInt(getRandom(128,255)),
                            b:parseInt(getRandom(128,255)),
                            c:parseInt(getRandom(128,255))
                        }
                    }
                    var a = getRandom(-Math.PI, Math.PI);
                    var x = getRandom(0, fanwei) * Math.cos(a) + this.x;
                    var y = getRandom(0, fanwei) * Math.sin(a) + this.y; 
                    var radius = getRandom(0 , 2)
                    var frag = new Frag(this.x , this.y , radius , color , x , y );
                    this.booms.push(frag);
                }
            },
            _shapBoom:function(){
                var that = this;
                putValue(ocas , octx , this.shape , 3, function(dots){
                    var dx = canvas.width/2-that.x;
                    var dy = canvas.height/2-that.y;
                    for(var i=0;i<dots.length;i++){
                        color = {a:dots[i].a,b:dots[i].b,c:dots[i].c}
                        var x = dots[i].x;
                        var y = dots[i].y;
                        var radius = 1;
                        var frag = new Frag(that.x , that.y , radius , color , x-dx , y-dy);
                        that.booms.push(frag);
                    }
                })
            }
        }

        function putValue(canvas , context , ele , dr , callback){
            context.clearRect(0,0,canvas.width,canvas.height);
            var img = new Image();
            if(ele.innerHTML.indexOf("img")>=0){
                img.src = ele.getElementsByTagName("img")[0].src;
                imgload(img , function(){
                    context.drawImage(img , canvas.width/2 - img.width/2 , canvas.height/2 - img.width/2);
                    dots = getimgData(canvas , context , dr);
                    callback(dots);
                })
            }
            else {
                var text = ele.innerHTML;
                context.save();
                var fontSize =100;
                context.font = fontSize+"px 宋体 bold";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "rgba("+parseInt(getRandom(128,255))+","+parseInt(getRandom(128,255))+","+parseInt(getRandom(128,255))+" , 1)";
                context.fillText(text , canvas.width/2 , canvas.height/2);
                context.restore();
                dots = getimgData(canvas , context , dr);
                callback(dots);
            }
        }

        function imgload(img , callback){
            if(img.complete){
                callback.call(img);
            }
            else {
                img.onload = function(){
                    callback.call(this);
                }
            }
        }

        function getimgData(canvas , context , dr){
            var imgData = context.getImageData(0,0,canvas.width , canvas.height);
            context.clearRect(0,0,canvas.width , canvas.height);
            var dots = [];
            for(var x=0;x<imgData.width;x+=dr){
                for(var y=0;y<imgData.height;y+=dr){
                    var i = (y*imgData.width + x)*4;
                    if(imgData.data[i+3] > 128){
                        var dot = {x:x , y:y , a:imgData.data[i] , b:imgData.data[i+1] , c:imgData.data[i+2]};
                        dots.push(dot);
                    }
                }
            }
            return dots;
        }

        function getRandom(a , b){
            return Math.random()*(b-a)+a;
        }


        var maxRadius = 1 , stars=[];
        function drawBg(){
            for(var i=0;i<100;i++){
                var r = Math.random()*maxRadius;
                var x = Math.random()*canvas.width;
                var y = Math.random()*2*canvas.height - canvas.height;
                var star = new Star(x , y , r);
                stars.push(star);
                star.paint()
            }

        }

        var Star = function(x,y,r){
            this.x = x;this.y=y;this.r=r;
        }
        Star.prototype = {
            paint:function(){
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x , this.y , this.r , 0 , 2*Math.PI);
                ctx.fillStyle = "rgba(255,255,255,"+this.r+")";
                ctx.fill();
                ctx.restore();
            }
        }

        var focallength = 250;
        var Frag = function(centerX , centerY , radius , color ,tx , ty){
            this.tx = tx;
            this.ty = ty;
            this.x = centerX;
            this.y = centerY;
            this.dead = false;
            this.centerX = centerX;
            this.centerY = centerY;
            this.radius = radius;
            this.color = color;
        }

        Frag.prototype = {
            paint:function(){
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x , this.y , this.radius , 0 , 2*Math.PI);
                ctx.fillStyle = "rgba("+this.color.a+","+this.color.b+","+this.color.c+",1)";
                ctx.fill()
                ctx.restore();
            },
            moveTo:function(index){
                this.ty = this.ty+0.3;
                var dx = this.tx - this.x , dy = this.ty - this.y;
                this.x = Math.abs(dx)<0.1 ? this.tx : (this.x+dx*0.1);
                this.y = Math.abs(dy)<0.1 ? this.ty : (this.y+dy*0.1);
                if(dx===0 && Math.abs(dy)<=80){
                    this.dead = true;
                }
                this.paint();
            }
        }

};