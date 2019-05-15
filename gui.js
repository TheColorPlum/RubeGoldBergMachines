var Domino = function() {
	this.Domino = function() { generateDomino() };
}

var Ball = function() {
	this.Ball = function() { generateBall() };
}

var Cube = function() {
	this.Cube = function() { generateLargeCube() };
}

var SeeSaw = function() {
	this.Seesaw = function() { generateSeeSaw() };
}

var InclinedPlane = function() {
	this.Inclined_Plane = function() { generateInclinedPlane() };
}

var Simulate = function() {
	this.Start = function() { Simulation() };
}

var Reset = function() {
	this.Reset = function() { ResetScene() };
}

var Restart = function() {
	this.Restart = function() {
		for (let i = 0; i < objects.length; i++){
			transformControls.detach();
			objects[i].material.dispose();
			objects[i].geometry.dispose();
			scene.remove(objects[i]);
			objects.pop();
			resetObjects.pop();
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
	var reset = new Restart();
	var restart = new Reset();
	gui.add(domino, 'Domino');
	gui.add(ball, 'Ball');
	gui.add(cube, 'Cube');
	// gui.add(seesaw, 'seesaw');
	gui.add(i_p, 'Inclined_Plane');
	gui.add(simulate, 'Start');
	gui.add(restart, 'Reset');
	gui.add(reset, 'Restart');
	
}

window.onload = function() {
  dropdown();
};