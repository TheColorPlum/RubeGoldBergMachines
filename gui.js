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

var Restart = function() {
	this.Restart = function() { RestartScene() };
}

var Reset = function() {
	this.Reset = function() {
		for (let i = objects.length - 1; i >= 0; i--){
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
	var reset = new Reset();
	var restart = new Restart();
	gui.add(domino, 'Domino');
	gui.add(ball, 'Ball');
	gui.add(cube, 'Cube');
	// gui.add(seesaw, 'seesaw');
	gui.add(i_p, 'Inclined_Plane');
	gui.add(simulate, 'Start');
	gui.add(restart, 'Restart');
	gui.add(reset, 'Reset')
	
}

window.onload = function() {
  dropdown();
};