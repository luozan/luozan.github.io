//粒子
game.Particle = function(position){
	this.position = position;
	this.velocity = new game.Vector2(0,0);
	this.age = 0;
	this.maxAge = 2000;
}

game.Particle.prototype.update = function(timeDelta){
	this.age += timeDelta;
	this.position.iadd(this.velocity.muls(timeDelta));
	return this.age < this.maxAge;
}
//粒子系统
game.ParticleSystem = function(){
	this.particles = [];
	this.forces = [];	
}

game.ParticleSystem.prototype.update = function(timeDelta){
	var alive = [];
	for(var i = 0;i < this.particles.length;i++){
		var particle = this.particles[i];
		for (var s = 0;s < this.forces.length;s++){
			this.forces[s](particle,timeDelta);
		}
		if(particle.update(timeDelta)){
			alive.push(particle);
		}
	}
	this.particles = alive;
}
