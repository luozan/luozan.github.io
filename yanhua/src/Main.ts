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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        var sky:egret.Bitmap = this.createBitmapByName("background");
        this.addChild(sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        //start button
        var startButton:egret.Bitmap = this.createBitmapByName("start_button");
        startButton.anchorX = 0.5;
        startButton.anchorY = 0.5;
        startButton.x = stageW/2;
        startButton.y = 341;
        startButton.touchEnabled = true;
        startButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(){
            startButton.scaleX = 0.9;
            startButton.scaleY = 0.9;
        },this);
        startButton.addEventListener(egret.TouchEvent.TOUCH_END,function(){
            startButton.scaleX = 1;
            startButton.scaleY = 1;
            startButton.visible = false;
            tipText.visible = false;
            match.visible = true;
        },this);
        this.addChild(startButton);

        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_END,function(){
            startButton.scaleX = 1;
            startButton.scaleY = 1;
            match.isDown = false;
        },this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,function(event){
            if(match.isDown == false)return;
            match.x = event.stageX;
            match.y = event.stageY;
        },this);
        
        //tip
        var tipText:egret.Bitmap = this.createBitmapByName('tip');
        tipText.anchorY = 0.5;
        tipText.x = 118;
        tipText.y = stageH/2;
        this.addChild(tipText);

        //match
        var match:any = this.createBitmapByName('match');
        match.anchorX = 0.5;
        match.anchorY = 0.5;
        match.x = stageW/2;
        match.y = stageH/2;
        match.visible = false;
        match.touchEnabled = true;
        match.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(){
            match.isDown = true;
        },this);
        match.addEventListener(egret.TouchEvent.TOUCH_END,function(){
            match.isDown = false;
        },this);
        this.addChild(match);
        //particle
        this.system = new particle.GravityParticleSystem(RES.getRes('fireTexture'), RES.getRes('fireData'));
        this.system.start();
        // var topMask:egret.Shape = new egret.Shape();
        // topMask.graphics.beginFill(0x000000, 0.5);
        // topMask.graphics.drawRect(0, 0, stageW, stageH);
        // topMask.graphics.endFill();
        // topMask.width = stageW;
        // topMask.height = stageH;
        // this.addChild(topMask);

        // var icon:egret.Bitmap = this.createBitmapByName("egretIcon");
        // icon.anchorX = icon.anchorY = 0.5;
        // this.addChild(icon);
        // icon.x = stageW / 2;
        // icon.y = stageH / 2 - 60;
        // icon.scaleX = 0.55;
        // icon.scaleY = 0.55;

        // var colorLabel:egret.TextField = new egret.TextField();
        // colorLabel.x = stageW / 2;
        // colorLabel.y = stageH / 2 + 50;
        // colorLabel.anchorX = colorLabel.anchorY = 0.5;
        // colorLabel.textColor = 0xffffff;
        // colorLabel.textAlign = "center";
        // colorLabel.text = "Hello Egret";
        // colorLabel.size = 20;
        // this.addChild(colorLabel);

        // var textfield:egret.TextField = new egret.TextField();
        // textfield.anchorX = textfield.anchorY = 0.5;
        // this.addChild(textfield);
        // textfield.x = stageW / 2;
        // textfield.y = stageH / 2 + 100;
        // textfield.alpha = 0;

        // this.textfield = textfield;

        // //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        // RES.getResAsync("description", this.startAnimation, this)
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
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
}


