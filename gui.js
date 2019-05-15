var Domino = function() {
	this.domino = function() { generateDomino() };
}

var Ball = function() {
	this.ball = function() { generateBall() };
}

var Cube = function() {
	this.cube = function() { generateLargeCube() };
}

var SeeSaw = function() {
	this.seesaw = function() { generateSeeSaw() };
}

var InclinedPlane = function() {
	this.inclined_plane = function() { generateInclinedPlane() };
}

var Simulate = function() {
	this.simulate = function() { Simulation() };
}

var Restart = function() {
	this.restart = function() {
		for (let i = 0; i < objects.length; i++){
			transformControls.detach();
			objects[i].material.dispose();
			objects[i].geometry.dispose();
			scene.remove(objects[i]);
		}
	}
}

function dropdown() {
	var gui = new dat.GUI();
	var domino = new Domino();
	var ball = new Ball();
	var cube = new Cube();
	var seesaw = new SeeSaw();
	var i_p = new InclinedPlane();
	var simulate = new Simulate();
	var restart = new Restart();
	gui.add(domino, 'domino');
	gui.add(ball, 'ball');
	gui.add(cube, 'cube');
	//gui.add(seesaw, 'seesaw');
	gui.add(i_p, 'inclined_plane');
	gui.add(simulate, 'simulate');
	gui.add(restart, 'restart')
}

window.onload = function() {
  dropdown();
};