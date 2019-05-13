var Domino = function() {
	this.create = function (){
		var domino_texture = new THREE.TextureLoader().load('../textures/domino.png');
		domino_texture.mapping = THREE.EquirectangularReflectionMapping;
	    var domino_material = Physijs.createMaterial(
			new THREE.MeshPhongMaterial( { flatShading: true, map: domino_texture } ),0, .9 // low restitution
		);

		var domino = new Physijs.BoxMesh(new THREE.BoxGeometry(70, 140, 35), domino_material);
		// domino.position.y += 80;
		// domino.position.x += 700;
		// domino.position.z -= 200;
		domino.castShadow = true;
		domino.receiveShadow = true;
		scene.add(domino);
		objects.push(domino);
	}
}

function dropdown() {
	var gui = new dat.GUI();
	var domino = new Domino();
	gui.add(domino, 'create');
	// gui.add(text, 'speed', -5, 5);
	// gui.add(text, 'displayOutline');
	// gui.add(text, 'explode');
}

window.onload = function() {
  dropdown();
};