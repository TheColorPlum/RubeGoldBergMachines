//////////////////////////////////////////////////////////////////////////////////
/*	*	*	*	*	*	*	*	*	* SETUP *	*	*	*	*	*	*	*	*	*/
//////////////////////////////////////////////////////////////////////////////////

Physijs.scripts.worker = './js/physijs_worker.js';
Physijs.scripts.ammo = '../ammo.js';

var camera, scene, raycaster, renderer, width, height, orbitControls, transformControls;
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
var objects = [];
var resetObjects = [];
var once = false;
var simulate = false;

init();
animate();

function init() {
	width = window.innerWidth;
	height = window.innerHeight;

	scene = new Physijs.Scene();
	scene.setGravity(new THREE.Vector3( 0, -100, 0));
	scene.addEventListener( 'update', function() {
		//your code. physics calculations have done updating
	});
	
	// Playground
	var grass = new THREE.TextureLoader().load('../textures/grass.png');
	grass.mapping = THREE.EquirectangularReflectionMapping;
	var ground_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial( {flatShading: true, map: grass } ), 0.8, .9 // low restitution
	);
	var ground = new Physijs.BoxMesh(new THREE.BoxGeometry(4000, 1, 4000), ground_material, 0 // mass
	);
	ground.receiveShadow = true;
	ground.position.x -= 500;
	scene.add(ground);

	// Walls
	var sky = new THREE.TextureLoader().load('../textures/sky.png');
	sky.mapping = THREE.EquirectangularReflectionMapping;
	var wall_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial( { flatShading: true, map: sky } ),0, .9 // low restitution
	);

	// Back Wall
	var back = new Physijs.BoxMesh(new THREE.BoxGeometry(4000, 3000, 1), wall_material, 0);
	back.receiveShadow = true;
	back.position.x -= 500;
	back.position.y += 1500;
	back.position.z -= 2000;
	scene.add(back);

	// Left Wall
	var left = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 3000, 4000), wall_material, 0);
	left.receiveShadow = true;
	left.position.y += 1500;
	left.position.x += 1500;
	scene.add(left);

	// Right Wall
	// Backwards :/
	var right = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 3000, 4000), wall_material, 0);
	right.receiveShadow = true;
	right.position.y += 1500;
	right.position.x -= 2500;
	scene.add(right);

	// Machine Space
	var sand = new THREE.TextureLoader().load('../textures/sand.png');
	sand.mapping = THREE.EquirectangularReflectionMapping;
	var ground_material2 = Physijs.createMaterial(
		new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, map: sand } ),0, .9 // low restitution
	);
	var machineSpace = new Physijs.BoxMesh(new THREE.BoxGeometry(400, 1, 750),ground_material2,0 // mass
	);
	machineSpace.receiveShadow = true;
	machineSpace.position.y += 10;
	machineSpace.position.x += 850;
	scene.add(machineSpace);

	// CAMERA
	camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100000);
	camera.position.set(0, 2000, 3250);
	scene.add(camera);

	// LIGHTS
	var light1 = new THREE.DirectionalLight( 0xffffff );
	light1.position.set( 1, 1, 1 );
	scene.add( light1 );
	var light2 = new THREE.DirectionalLight( 0x002288 );
	light2.position.set( - 1, - 1, - 1 );
	scene.add( light2 );
	var light3 = new THREE.DirectionalLight( 0xffffff );
	light3.position.set( - 1, -1, 0 );
	scene.add( light3 );
	var light4 = new THREE.AmbientLight( 0xffffff ); //0x222222
	scene.add( light4 );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	document.body.appendChild(renderer.domElement);

	//var clock = new THREE.Clock;

	// Orbit controls
	orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
	orbitControls.enableKeys = false;

	// Transform controls
	transformControls = new THREE.TransformControls(camera, renderer.domElement);    
	transformControls.addEventListener('change', render);
	transformControls.addEventListener('mouseDown', function () {
		orbitControls.enabled = false;
	});
	transformControls.addEventListener('mouseUp', function () {
		orbitControls.enabled = true;
	});
	window.addEventListener('keydown', function(event) {
		if(event.code == 'KeyR') {
			transformControls.setMode("rotate");
		} else if (event.code == 'KeyT') {
			transformControls.setMode("translate");
		} else if (event.code == 'KeyS') {
			transformControls.setMode("scale");
		} else if (event.code == 'Space') {
			!(transformControls.enabled);
		} else return;
	});
	scene.add(transformControls);

	// Selecting objects on mouse click
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

}

//////////////////////////////////////////////////////////////////////////////////
/*	*	*	*	*	*	*	*	*	FUNCTIONS 	*	*	*	*	*	*	*	*	*/
//////////////////////////////////////////////////////////////////////////////////
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() {
	requestAnimationFrame( animate );

	render();
}

function render() {
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

	if(intersects.length > 0) {
		if(objects.includes(intersects[0].object)) {
			transformControls.attach(intersects[0].object);
		}
	}

	orbitControls.update();
	renderer.clear();

	if (simulate) {
		scene.simulate();
	}

	for(var i = 0; i < objects.length; i++){
		var bbox = new THREE.Box3().setFromObject(objects[i]);
		if (bbox.min.y < 0) {
			objects[i].position.y = objects[i].position.y + (0-bbox.min.y);
		}
	}

	renderer.render( scene, camera );
}

window.addEventListener( 'mousemove', onMouseMove, false );


//////////////////////////////////////////////////////////////////////////////////
/*	*	*	*	*	*	*	*	*	 MACHINES 	*	*	*	*	*	*	*	*	*/
//////////////////////////////////////////////////////////////////////////////////

var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
//DOMINO FIRST thank you
function generateDomino() {
	var domino_texture = new THREE.TextureLoader().load('../textures/domino.png');
	domino_texture.mapping = THREE.EquirectangularReflectionMapping;
	var domino_material = new THREE.MeshPhongMaterial( { flatShading: true, map: domino_texture } );

	var domino = new THREE.Mesh(new THREE.BoxGeometry(70, 140, 35), domino_material);
	domino.position.y += 80;
	domino.position.x += 700;
	domino.position.z -= 200;
	domino.castShadow = true;
	domino.receiveShadow = true;
	domino.name = domino.uuid;
	scene.add(domino);
	objects.push(domino);
}

function generateBall() {
	//ball next thank you
	var ball_texture = new THREE.TextureLoader().load('../textures/ball.png');
	ball_texture.mapping = THREE.SphericalReflectionMapping;
	var ball_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial( { flatShading: true, map: ball_texture } ),0, .9 // low restitution
	);

	var ball = new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100 ), ball_material);
	ball.position.y += 40;
	ball.position.x += 700;
	ball.castShadow = true;
	ball.receiveShadow = true;
	ball.name = ball.uuid;
	scene.add(ball);
	objects.push(ball);
}

function generateLargeCube() {
	// Large Cube
	var large = new THREE.MeshPhongMaterial({ color: 0xd368f9, flatShading: true });
	var cube = new THREE.Mesh(new THREE.BoxGeometry(120, 120, 120), large, 0);
	cube.position.z -= 200;
	cube.position.y += 70;
	cube.position.x += 850;
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.name = cube.uuid;
	scene.add(cube);
	objects.push(cube);
}

function generateMediumCube() {
	// Medium Cube
	var medium = new THREE.MeshPhongMaterial({ color: 0xf9e368, flatShading: true });
	var cubeM = new THREE.Mesh(new THREE.BoxGeometry(60, 60, 60), medium, 0);
	cubeM.position.y += 40;
	cubeM.position.x += 850;
	cubeM.castShadow = true;
	cubeM.receiveShadow = true;
	cubeM.name = cubeM.uuid;
	scene.add(cubeM);
	objects.push(cubeM);
}

function generateSmallCube() {
	// Small Cube
	var small = new THREE.MeshPhongMaterial({ color: 0x3676f7, flatShading: true });
	var cubeS = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), small, 0);
	cubeS.position.z += 100;
	cubeS.position.y += 25;
	cubeS.position.x += 850;
	cubeS.castShadow = true;
	cubeS.receiveShadow = true;
	cubeS.name = cubeS.uuid;
	scene.add(cubeS);
	objects.push(cubeS);
}

function generateSeeSaw() {
	// SeeSaw
	var wood_texture = new THREE.TextureLoader().load('../textures/wood.png');
	wood_texture.mapping = THREE.SphericalReflectionMapping;
	var wood_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial( { flatShading: true, map: wood_texture } ),0, .9 // low restitution
	);

	var stand_color = new THREE.MeshPhongMaterial({ color: 0xef2354, flatShading: true });
	var fulcrum = new Physijs.ConeMesh(new THREE.CylinderGeometry(10, 30, 30), stand_color);
	fulcrum.position.x += 700;
	fulcrum.position.y += 25;
	fulcrum.position.z += 200;
	fulcrum.castShadow = true;
	fulcrum.receiveShadow = true;
	fulcrum.name = fulcrum.uuid;
	scene.add(fulcrum);
	objects.push(fulcrum);

	var seesaw = new Physijs.BoxMesh(new THREE.BoxGeometry(200, 10, 70), wood_material);
	seesaw.position.y += 45;
	seesaw.position.x += 695;
	seesaw.position.z += 200;
	seesaw.castShadow = true;
	seesaw.receiveShadow = true;
	seesaw.name = scene.uuid;
	scene.add(seesaw);
	objects.push(seesaw);

}
// SeeSaw Constraint
// var constraint = new Physijs.HingeConstraint(
//   		fulcrum, // First object to be constrained
//   		seesaw, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
//   		new THREE.Vector3( 0, 10, 0 ), // point in the scene to apply the constraint
//   		new THREE.Vector3( 1, 0, 0 ) // Axis along which the hinge lies - in this case it is the X axis
// );
// scene.addConstraint( constraint );
// constraint.setLimits(
//     low, // minimum angle of motion, in radians
//     high, // maximum angle of motion, in radians
//     bias_factor, // applied as a factor to constraint error
//     relaxation_factor, // controls bounce at limit (0.0 == no bounce)
// );
// constraint.enableAngularMotor( target_velocity, acceration_force );
// constraint.disableMotor();

function generateInclinedPlane() {
	// Inclined Plane
	var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	geometry.vertices.push(new THREE.Vector3(-100, 0, 0));
	geometry.vertices.push(new THREE.Vector3(-100, 0, -100));
	geometry.vertices.push(new THREE.Vector3(-100, 100, -100));
	geometry.vertices.push(new THREE.Vector3(0, 100, -100));
	geometry.vertices.push(new THREE.Vector3(0, 0, -100));

	var face0 = new THREE.Face3(4, 1, 0);
	var face0r = new THREE.Face3(4, 3, 1);
	var face1 = new THREE.Face3(3, 2, 1);
	var face2 = new THREE.Face3(2, 3, 4);
	var face2r = new THREE.Face3(2, 4, 5);
	var face3 = new THREE.Face3(0, 1, 5);
	var face3r = new THREE.Face3(5, 2, 1);
	var face4 = new THREE.Face3(0, 5, 4);

	geometry.faces.push(face0, face1, face2, face3, face4, face0r, face2r, face3r);
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	var inclinedPlane = new THREE.Mesh(geometry, material);
	inclinedPlane.position.x += 875;
	inclinedPlane.position.y += 10;
	inclinedPlane.position.z += 200;
	scene.add(inclinedPlane);
	objects.push(inclinedPlane);
}

//////////////////////////////////////////////////////////////////////////////////
/*	*	*	*	*	*	*	*	*	 SIMULATE 	*	*	*	*	*	*	*	*	*/
//////////////////////////////////////////////////////////////////////////////////
function Simulation() {

	// Convert every object in the scene into a physijs mesh
	transformControls.detach();

	var length = scene.children.length - 1;

	for (var i = length; i >= 0; i--) {

		// Verify that the object we're looking at is a rube mesh
		var mesh = scene.children[i];
		mesh = scene.getObjectByName(mesh.name);
		if(mesh.type != "Mesh" || !objects.includes(mesh)) {
			continue;
		}

		// Clone the necessary aspects of the mesh
		var mat = mesh.material.clone();
		var position = mesh.position.clone();
		var rotation = mesh.rotation.clone();
		var geometry = mesh.geometry;

		// add physics to mesh
		var material = new Physijs.createMaterial(mat, .8, .7);

		// Create the new Physijs mesh
		var physMesh;
		if (geometry.type === "SphereGeometry") {
			physMesh = new Physijs.SphereMesh(geometry, material, 1);
			
		} else {
			physMesh = new Physijs.BoxMesh(geometry, material, 1);
		}
		
		physMesh.position.set(position.x, position.y, position.z);
		physMesh.rotation.set(rotation.x, rotation.y, rotation.z);
		physMesh.__dirtyPosition = true;
		physMesh.__dirtyRotation = true;
		physMesh.name = physMesh.uuid;
		physMesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			// `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
		});

		// Remove all trace of the old mesh
		var index = objects.indexOf(mesh);
		if (index > -1) {
			resetObjects.push(objects[index]);
			objects.splice(index, 1, physMesh)[0];
		}
		 
		scene.remove(mesh);
	}

	// Add everything to the scene
	for (var i = 0; i < objects.length; i++) {
		scene.add(objects[i]);
	}

	simulate = true;
}

// Set all objects back to their original positions before simulate was run
function RestartScene() {

	simulate = false;

	transformControls.detach();

	for (var i = objects.length - 1; i >= 0; i--) {
		scene.remove(objects[i]);

		objects[i].material.dispose()
		objects[i].geometry.dispose();

		objects[i] = resetObjects[i];

		scene.add(objects[i]);
	}

}
	// Pendulum
// Swing
// var swingMass = 1.2;
// var swingRadius = 50;
// var swing = new Physijs.SphereMesh( new THREE.SphereGeometry( swingRadius, 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x202020, flatShading: true } ) );
// swing.castShadow = true;
// swing.receiveShadow = true;
// swing.position.set(150, 70, -200);
// scene.add(swing);
// objects.push(swing);

// Stand
//var base = new Physijs.BoxMesh(new THREE.BoxGeometry(10, 10, 70), material);