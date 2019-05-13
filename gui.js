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

function dropdown() {
	var gui = new dat.GUI();
	var domino = new Domino();
	var ball = new Ball();
	var cube = new Cube();
	var seesaw = new SeeSaw();
	var i_p = new InclinedPlane();
	gui.add(domino, 'domino');
	gui.add(ball, 'ball');
	gui.add(cube, 'cube');
	gui.add(seesaw, 'seesaw');
	gui.add(i_p, 'inclined_plane');
}

window.onload = function() {
  dropdown();
};