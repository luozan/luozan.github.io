(function(){
	var root = this;
	var game = game || {};

	game.STAGE_WIDTH = 800;
	game.STAGE_HEIGHT = 600;
	game.STAGE_COLOR = '#000000';

	game.canvas = null;
	game.context = null;

	game.particles = null;

	game.timeDelta = 0;

	game.lastTime = 0;

	game.timer = 0;

	game.init = function(){
		var canvas = document.createElement('canvas');
		canvas.width = game.STAGE_WIDTH;
		canvas.height = game.STAGE_HEIGHT;
		canvas.style.backgroundColor = game.STAGE_COLOR;
		document.body.appendChild(canvas);

		var context = canvas.getContext('2d');
		game.canvas = canvas;
		game.context = context;
		game.loadFiles();
	}

	game.sence = function(){
		var system = new game.ParticleSystem();
		game.system = system;
		game.gravity = Physics.accelerationf(new game.Vector2(0,0.001));
		system.forces.push(game.gravity);
		game.emit(system,100,100);
	}

	game.main = function(){ 
		game.context.clearRect(0,0,game.STAGE_WIDTH,game.STAGE_HEIGHT);
		game.system.update(game.timeDelta);
		game.particles = game.system.particles;
		if (game.particles.length == 0) {
			game.emit(game.system,100,100);
		}
		game.renderParticle(game.context,game.particles);
		var nowTime = new Date().getTime();
		game.timeDelta = nowTime - game.lastTime;
		game.lastTime = nowTime;
		requestAnimationFrame(game.main);
	}

	game.renderParticle = function(cxt,particles){
		var texture = particles[0].texture;
		for (var i = 0; i < particles.length; i++) {
			var particle = particles[i];
			cxt.save();
			cxt.translate(particle.position.x,particle.position.y);
			cxt.drawImage(texture,0,0);
			cxt.restore();
		}
	}

	game.loadFiles = function(){
		var total = 0;
		var loaded = 0;
		for(var key in $Config){
			var script = document.createElement('script');
			script.src = libPath+$Config[key];
			document.body.appendChild(script);
			script.onload = script.onreadystatechange = function(){
				loaded++;
				if (total == loaded) {
					game.sence();
					game.lastTime = new Date().getTime();
					game.main();
				};
			}
			total++;
		}
	}

	game.emit = function(system,width,height){
		var position = new game.Vector2(200+Math.random()*(game.STAGE_WIDTH-200),200+Math.random()*(game.STAGE_HEIGHT-300));
		var image = document.getElementById('texture');
		for(var i = 0;i < 100;i++){
			var particle = new game.Particle(position.copy());
			particle.velocity.x = (Math.random()-0.5)*0.5;
			particle.velocity.y = (Math.random()-0.5)*0.5;
			particle.texture = image;
			system.particles.push(particle);
		}
		game.particles = system.particles;
	}

	root.game = game;
}).call(this);