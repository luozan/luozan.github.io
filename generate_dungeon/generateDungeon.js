/* 
* 地牢生成 
*/
var mapType = {
	//墙
	"Wall":-1,
	//地面
	"Floor":0,
	//门
	"Door":1,
	//黑色无法访问的格子
	"test":2,
	"test2":3
}
var Dungeon = function(maxSizeX,maxSizeY,minCaveWidth,minCaveHeight){
	//地图的宽高
	this.maxSizeX = maxSizeX;
	this.maxSizeY = maxSizeY;
	//山洞最小宽高
	this.minCaveWidth = minCaveWidth;
	this.minCaveHeight = minCaveHeight; 
	//地图
	this.map = [];
	this.AreaList = [];
	//山洞区域边距
	this.caveMargin = 1;
	//房间区域边距
	this.roomMargin = 1;
	//初始权重
	this.initialWeight = 0.40;
}

//生成地牢
Dungeon.prototype.create = function(){
	//初始化地图
	this.map = [];
	this.AreaList = [];
	for(var x = 0;x < this.maxSizeX;x++){
		this.map[x] = [];
		for(var y = 0; y < this.maxSizeY;y++){
			this.map[x][y] = mapType.Wall;
		}
	}

	//根区域
	var rootArea = new Area(0,0,this.maxSizeX,this.maxSizeY,null,null,0);

	//划分区域
	this.partitionArea(rootArea);
	//创建房间
	this.createRoom(rootArea);
	//连接区域
	this.connectAreas(rootArea);
	//清除最外层可能会出现的多余部分
	this.clearBorder();
	
	//返回地图数据
	return this.map;
};

Dungeon.prototype.clearBorder = function(){
	for(var x = 0; x < this.maxSizeX; x++){
		this.map[x][0] = this.map[this.maxSizeX-1][x] = this.map[x][this.maxSizeX-1]= this.map[0][x] = mapType.Wall;
	}

	for(var x = 0; x < this.maxSizeX;x++){
		for(var y = 0; y < this.maxSizeY;y++){
			var count = this.countFloors(this.map,x,y,1,this.maxSizeX,this.maxSizeY);
			if(count == 0){
				this.map[x][y] = mapType.test;
			}
		}
	}
}

//二分法分割地牢区域
Dungeon.prototype.partitionArea = function(area){
	var areaSize = 8;
	//分割完成(在满足至少递归一次的前提条件下，达成另外俩个条件中的一个：一、当前划分的区域大小小于等于设定的最小区域大小；二、根据递归深度随机产生结果，深度约大越容易产生true的结果)
	if(((area.width <= areaSize || area.height <= areaSize) || Math.random() <= 0.10 * area.depth) && area.depth > 0){
		//判断当前区域的规模
		area.size = this.getSizeOfArea(area);
		this.AreaList.push(area);
		return;
	}
	else if(area.width >= area.height && area.width > areaSize){
		//平分成左右两个区域
		area.subArea1 = new Area(area.startX, area.startY, area.center.x, area.endY, null, null, area.depth + 1);
		area.subArea2 = new Area(area.center.x, area.startY, area.endX, area.endY, null, null, area.depth + 1);
		//继续分割
		this.partitionArea(area.subArea1);
		this.partitionArea(area.subArea2);
	}
	else if(area.height > areaSize){
		//平分成上下两个区域
		area.subArea1 = new Area(area.startX, area.startY, area.endX, area.center.y, null, null, area.depth + 1);
		area.subArea2 = new Area(area.startX, area.center.y, area.endX, area.endY, null, null, area.depth + 1);
		//继续分割
		this.partitionArea(area.subArea1);
		this.partitionArea(area.subArea2);
	}
}

//创建房间
Dungeon.prototype.createRoom = function(area){
	//判断是否是最终分割成的区域
	if(area.subArea1 == null && area.subArea2 == null){
		//创建为山洞
		if(area.width >= this.maxSizeX / 2 && area.height >= this.maxSizeY /2){
			this.fillCave(area);
			area.type = 'Cave';
		}
		else{
			this.fillRoom(area);
			area.type = 'Dungeon';
		}
	}
	else{
		//遍历子区域,直到是最终分割成的区域
		this.createRoom(area.subArea1);
		this.createRoom(area.subArea2);
	}
}

//连接区域
Dungeon.prototype.connectAreas  = function(area){
	//判断是否是最终分割成的区域
	if(area.subArea1 == null && area.subArea2 == null){
		return;
	}

	var subArea1 = area.subArea1;
	var subArea2 = area.subArea2;

	this.connectAreas(subArea1);
	this.connectAreas(subArea2);

	//根据深度连接区域，深度小的连接两次，深度小的连接一次
	if(area.depth === 0){
		//创建通道
		this.createHall(this.randomOpenIndex({startX:subArea1.center.x,startY:subArea1.startY,endX:subArea1.endX,endY:subArea1.center.y}),this.randomOpenIndex({startX: subArea2.startX, startY: subArea2.startY, endX: subArea2.center.x, endY: subArea2.center.y}))
		this.createHall(this.randomOpenIndex({startX:subArea1.center.x, startY:subArea1.center.y, endX:subArea1.endX, endY:subArea1.endY}),this.randomOpenIndex({startX:subArea2.startX, startY:subArea2.center.y, endX:subArea2.center.x, endY: subArea2.endY}));
	}
	else if(area.depth == 1){
        this.createHall(this.randomOpenIndex({startX: subArea1.startX, startY: subArea1.center.y, endX: subArea1.center.x, endY: subArea1.endY}),this.randomOpenIndex({startX: subArea2.startX, startY: subArea2.startY, endX: subArea2.center.x, endY: subArea2.center.y}));
                
		this.createHall(this.randomOpenIndex({startX: subArea1.center.x, startY: subArea1.center.y, endX: subArea1.endX, endY: subArea1.endY}),this.randomOpenIndex({startX: subArea2.center.x, startY: subArea2.startY, endX: subArea2.endX, endY: subArea2.center.y}));
	}
	else if(area.depth == 2){
        this.createHall(this.randomOpenIndex({startX: subArea1.center.x, startY: subArea1.startY, endX: subArea1.endX, endY: subArea1.center.y}),this.randomOpenIndex({startX: subArea2.startX, startY: subArea2.startY, endX: subArea2.center.x, endY: subArea2.center.y}));
        
		if (Math.random() < 0.5) {
            this.createHall(this.randomOpenIndex({startX: subArea1.center.x, startY: subArea1.center.y, endX: subArea1.endX, endY: subArea1.endY}),this.randomOpenIndex({startX: subArea2.startX, startY: subArea2.center.y, endX: subArea2.center.x, endY: subArea2.endY}));
        }
	}
	else{
        this.createHall(this.randomOpenIndex(area.subArea1),this.randomOpenIndex(area.subArea2));
	}
}

//创建通道
Dungeon.prototype.createHall = function(start,end){
	var wide = Math.random() <= 0.4;

    // 连接房间，生成走廊:
    var min;
    var max;
    //左右
    if (start.x < end.x) {
    	min = start.x;
    	max = end.x;
    } else {
    	min = end.x;
    	max = start.x;
    }

    for (var x = min; x <= max; x += 1) {
        if (this.map[x][start.y] === mapType.Wall) {
            this.map[x][start.y] = mapType.Floor;
        }
        
        // Wide halls:
        if (wide === true && this.inBounds({x: x, y: start.y - 1},0,0,this.maxSizeX,this.maxSizeY)) {
	        if (this.map[x][start.y - 1] === mapType.Wall) {
	            this.map[x][start.y - 1] = mapType.Floor;
	        }
        }
    }

    //上下
    if (start.y < end.y) {
    	min = start.y;
    	max = end.y;
    } else {
    	min = end.y;
    	max = start.y;
    }

    for (var y = min; y <= max; y += 1) {
        if (this.map[end.x][y] === mapType.Wall) {
            this.map[end.x][y] = mapType.Floor;
        }
        
        // Wide halls:
        if (wide === true && this.inBounds({x: end.x - 1, y: y},0,0,this.maxSizeX,this.maxSizeY)) {
	        if (this.map[end.x - 1][y] === mapType.Wall) {
	            this.map[end.x - 1][y] = mapType.Floor;
	        }
        }
    }
}

//随机找到区域中的一个地面
Dungeon.prototype.randomOpenIndex = function(box){
    var x = this.integerInRange(box.startX, box.endX - 1);
    var y = this.integerInRange(box.startY, box.endY - 1);
    while (this.map[x][y] === mapType.Wall) {
        x = this.integerInRange(box.startX, box.endX - 1);
        y = this.integerInRange(box.startY, box.endY - 1);
    }
    
    return {x: x, y: y};
}

//填充房间
Dungeon.prototype.fillRoom = function(area){
	var minRoomWidth = area.width / 2 + 1;
	var minRoomHeight =  area.height / 2 + 1;

	var startX = this.integerInRange(area.startX + this.roomMargin, area.endX - minRoomWidth - this.roomMargin - 1);
	var startY = this.integerInRange(area.startY + this.roomMargin, area.endY - minRoomHeight - this.roomMargin - 1);
	var endX = this.integerInRange(startX + minRoomWidth, area.endX - this.roomMargin);
	var endY = this.integerInRange(startY + minRoomHeight, area.endY - this.roomMargin);

	var width = endX - startX + 1;
	var height = endY - startY + 1;

	//填充地面
	for(var x = startX; x < endX;x++){
		for(var y = startY;y < endY; y++){
			this.map[x][y] = mapType.Floor;
		}
	}

	//生成房间里的石柱
	if(width >= 6 && Math.random() <= 0.05){
		for(var y = startY + 1; y < endY - 1;y += 2){
			this.map[startX + 1][y] = mapType.Wall;
			this.map[endX - 2][y] = mapType.Wall;
		}
	}
	//上下分割房间
	else if(height >= 8 && Math.random() <= 0.4){
        for (var x = startX; x < endX; x += 1) {
            this.map[x][Math.floor(startY + Math.floor(height / 2)) - 1] = mapType.Wall;
        }
        
        this.map[startX + Math.floor(width / 2)][startY + Math.floor(height / 2) - 1] = mapType.Floor;
	}


}
//产生a－b的随机整数
Dungeon.prototype.integerInRange = function(a,b){
	return Math.round(a+Math.random()*Math.abs(b-a));
}
//填充山洞
Dungeon.prototype.fillCave = function(area){
	//防止出现死路
	while(true){
		if(this.fillCaveFunc(area)){
			break;
		}
	}
	// // console.log(this.map);
 //    area.isRoomWall = function (x, y) {
 //        return false;
 //    };
}

Dungeon.prototype.fillCaveFunc = function(area){
	var success = false;

	//计算区域除去边界的宽高
	var areaWidth = area.endX - area.startX - this.caveMargin * 2;
	var areaHeight = area.endY - area.startY - this.caveMargin * 2;
	//初始化区域地图
	var areaMap = [];
	for(var x = 0;x < areaWidth;x++){
		areaMap[x] = [];
		for(var y = 0; y < areaHeight;y++){
			if(Math.random() <= this.initialWeight){
				areaMap[x][y] = mapType.Wall;
			}
			else{
				areaMap[x][y] = mapType.Floor;
			}
		}
	}

	//第一次降噪
	for(var i = 0; i < 4;i++){
		var newMap = [];
		for(var x = 0; x < areaWidth; x++){
			newMap[x] = [];
			for(var y = 0; y < areaHeight; y++){
				newMap[x][y] = this.countWalls(areaMap,x,y,1,areaWidth,areaHeight) >= 5 || this.countWalls(areaMap,x,y,2,areaWidth,areaHeight) <= 3 ? mapType.Wall : mapType.Floor;
			}
		}
	}
	areaMap = newMap;
	var floor;

	//第二次降噪
	for(var i = 0; i < 3; i++){
		var newMap = [];
		for(var x = 0; x < areaWidth; x++){
			newMap[x] = [];
			for(var y = 0; y < areaHeight; y++){
				newMap[x][y] = this.countWalls(areaMap,x,y,1,areaWidth,areaHeight) >= 5 ? mapType.Wall : mapType.Floor;
				if(newMap[x][y] == mapType.Floor){
					floor = {"x":x,"y":y};
				}
			}
		}
	}

	areaMap = newMap;

	//拓印地图
	var result = {
		"count":0
	};
	var floodMap = [];
    for (var x = 0; x < areaWidth; x += 1) {
        floodMap[x] = [];
        for (var y = 0; y < areaHeight; y += 1) {
            floodMap[x][y] = areaMap[x][y] === mapType.Wall ? 1 : 0;
        }
    }
    this.bfs(floodMap,floor.x,floor.y,areaWidth,areaHeight,result);
    // console.log(result.count);
    if (result.count > areaWidth * areaHeight * 0.60) {
        for (var x = 0; x < areaWidth; x += 1) {
            for (var y = 0; y < areaHeight; y += 1) {
                areaMap[x][y] = floodMap[x][y] === 2 ? mapType.Floor : mapType.Wall;
            }
        }
        success = true;
    }

    for (var x = 0; x < areaWidth; x += 1) {
        for (var y = 0; y < areaHeight; y += 1) {
            this.map[area.startX + this.caveMargin + x][area.startY + this.caveMargin + y] = areaMap[x][y];
        }
    }

    return success;
}

//遍历地图
Dungeon.prototype.bfs = function(floodMap,x,y,areaWidth,areaHeight,result){
    result.count += 1;
    floodMap[x][y] = 2;
    if (this.inBounds({x:x+1,y:y},0,0,areaWidth,areaHeight) && floodMap[x + 1][y] === 0) {
        this.bfs(floodMap,x + 1, y,areaWidth,areaHeight,result);
    }
    if (this.inBounds({x:x-1,y:y},0,0,areaWidth,areaHeight) && floodMap[x - 1][y] === 0) {
        this.bfs(floodMap,x - 1, y,areaWidth,areaHeight,result);
    }
    if (this.inBounds({x:x,y:y+1},0,0,areaWidth,areaHeight) && floodMap[x][y + 1] === 0) {
        this.bfs(floodMap,x, y + 1,areaWidth,areaHeight,result);
    }
    if (this.inBounds({x:x,y:y-1},0,0,areaWidth,areaHeight) && floodMap[x][y - 1] === 0) {
        this.bfs(floodMap,x, y - 1,areaWidth,areaHeight,result);
    }
}

//判断点是否在界限内
Dungeon.prototype.inBounds = function(p,x,y,width,height){
	return p.x >= x && p.y >= y && p.x < width && p.y <height;
}

//统计范围内的墙
Dungeon.prototype.countWalls = function(map,x,y,dist,width,height){
	var count = 0;
	for(var i = x - dist; i <= x + dist; i++){
		for(var j = y - dist;j <= y + dist; j++){
			count += !(this.inBounds({x:i,y:j},0,0,width,height)) || map[i][j] === mapType.Wall ? 1 : 0;
		}
	}
	return count;
}

//统计范围内的墙
Dungeon.prototype.countFloors = function(map,x,y,dist,width,height){
	var count = 0;
	for(var i = x - dist; i <= x + dist; i++){
		for(var j = y - dist;j <= y + dist; j++){
			count += (this.inBounds({x:i,y:j},0,0,width,height)) && map[i][j] === mapType.Floor ? 1 : 0;
		}
	}
	return count;
}


//根据区域的面积判断区域大小
Dungeon.prototype.getSizeOfArea = function(area){
    if (area.width * area.height === this.maxSizeX * (this.maxSizeY/ 2)) {
        return 'Large';
    } else if (area.width * area.height === (this.maxSizeX / 2) * (this.maxSizeY / 2)) {
        return 'Medium';
    } else if (area.width * area.height === (this.maxSizeX / 4) * (this.maxSizeY / 2)) {
        return 'Small';
    } else {
        return 'Tiny';
    }
}

Dungeon.prototype.constructor = Dungeon;

/*
* 描述一个地牢区域的对象
*/
var Area = function(startX,startY,endX,endY,subArea1,subArea2,depth){
	this.size = '';
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	//子区域
	this.subArea1 = subArea1;
	this.subArea2 = subArea2;

	//计算水平和垂直的距离
	this.width = this.endX - this.startX;
	this.height = this.endY - this.startY;
	//计算中心点
	this.center = {
		"x":0,
		"y":0
	}
	this.center.x = this. startX + Math.floor(this.width/2);
	this.center.y = this. startY + Math.floor(this.height/2);
	this.depth = depth;
}