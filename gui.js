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

function dropdown() {
	var gui = new dat.GUI();
	var domino = new Domino();
	var ball = new Ball();
	var cube = new Cube();
	var seesaw = new SeeSaw();
	var i_p = new InclinedPlane();
	var simulate = new Simulate();
	gui.add(domino, 'domino');
	gui.add(ball, 'ball');
	gui.add(cube, 'cube');
	gui.add(seesaw, 'seesaw');
	gui.add(i_p, 'inclined_plane');
	gui.add(simulate, 'simulate');
}

window.onload = function() {
  dropdown();
};