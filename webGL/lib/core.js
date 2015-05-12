(function(){

	var root = this;

	var core = core||{};
	
	core.createCanvas = function(){
		var canvas = document.createElement('canvas');
		canvas.width = 800;
		canvas.height = 600;
		document.body.appendChild(canvas);
	}
	root.core = core;
}).call(this);