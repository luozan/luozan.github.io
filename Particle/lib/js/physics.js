(function(){
	var root = this;
	var Physics = Physics||{};

	Physics.accelerationf = function(force){
		return function(particle,timeDelta){
			particle.velocity.iadd(force.muls(timeDelta));
		}
	}

	root.Physics = Physics;
}).call(this);