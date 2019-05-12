		Physijs.scripts.worker = './js/physijs_worker.js';
		Physijs.scripts.ammo = '../ammo.js';

		var width = window.innerWidth;
		var height = window.innerHeight;

		var scene = new Physijs.Scene;
		//scene.setGravity(new THREE.Vector3( 0, -10, 0));
		
		scene.addEventListener( 'update', function() {
			//your code. physics calculations have done updating
		});
		
		// Playground
		var grass = new THREE.TextureLoader().load('../textures/grass.png');
		grass.mapping = THREE.EquirectangularReflectionMapping;
	    var ground_material = Physijs.createMaterial(
			new THREE.MeshPhongMaterial( { color: 0x008080, flatShading: true, map: grass } ),0, .9 // low restitution
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

	    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);

	    camera.position.y = 160; 
		camera.position.z = 400; 

		scene.add(camera);

	    var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		document.body.appendChild(renderer.domElement);

		var clock = new THREE.Clock;

		// Orbit controls
		var controls = new THREE.OrbitControls(camera);
		controls.enabled = true;
		controls.enablePan = true;
		controls.enableZoom = true;
		controls.enableKeys = true;

		function render() {
			controls.update();
			renderer.render(scene, camera);
    		requestAnimationFrame(render);
		}
 
		render();

		camera.lookAt(ground.position);

		var light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		scene.add( light );
		var light = new THREE.DirectionalLight( 0x002288 );
		light.position.set( - 1, - 1, - 1 );
		scene.add( light );
		var light = new THREE.AmbientLight( 0x222222 );
		scene.add( light );


		// Lets add some shapes!
		var objects = [];
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });


		//DOMINO FIRST thank you
		var domino_texture = new THREE.TextureLoader().load('../textures/domino.png');
		domino_texture.mapping = THREE.EquirectangularReflectionMapping;
	    var domino_material = Physijs.createMaterial(
			new THREE.MeshPhongMaterial( { flatShading: true, map: domino_texture } ),0, .9 // low restitution
		);

		for(var i = 0; i < 100; i++) {
			var domino = new Physijs.BoxMesh(new THREE.BoxGeometry(70, 140, 35), domino_material);
			domino.position.y += 80;
			domino.position.x += 700;
			domino.position.z -= 200;
			domino.castShadow = true;
			domino.receiveShadow = true;
			scene.add(domino);
			objects.push(domino);
		}

		

		//ball next thank you
		var ball_texture = new THREE.TextureLoader().load('../textures/ball.png');
		ball_texture.mapping = THREE.SphericalReflectionMapping;
		var ball_material = Physijs.createMaterial(
			new THREE.MeshPhongMaterial( { flatShading: true, map: ball_texture } ),0, .9 // low restitution
		);

		for(var i = 0; i < 100; i++) {
			var ball = new Physijs.SphereMesh(new THREE.SphereGeometry(30, 30, 30 ), ball_material);
			ball.position.y += 40;
			ball.position.x += 700;
			ball.castShadow = true;
			ball.receiveShadow = true;
			scene.add(ball);
			objects.push(ball);
		}

		// Large Cube
		for(var i = 0; i < 100; i++) {
			var large = new THREE.MeshPhongMaterial({ color: 0xd368f9, flatShading: true });
			var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(120, 120, 120), large, 0);
			cube.position.z -= 200;
			cube.position.y += 70;
			cube.position.x += 850;
			cube.castShadow = true;
			cube.receiveShadow = true;
			scene.add(cube);
			objects.push(cube);
		}

		// Medium Cube
		for(var i = 0; i < 100; i++) {
			var medium = new THREE.MeshPhongMaterial({ color: 0xf9e368, flatShading: true });
			var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 60, 60), medium, 0);
			cube.position.y += 40;
			cube.position.x += 850;
			cube.castShadow = true;
			cube.receiveShadow = true;
			scene.add(cube);
			objects.push(cube);
		}

		// Small Cube
		for(var i = 0; i < 100; i++) {
			var small = new THREE.MeshPhongMaterial({ color: 0x3676f7, flatShading: true });
			var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(30, 30, 30), small, 0);
			cube.position.z += 100;
			cube.position.y += 25;
			cube.position.x += 850;
			cube.castShadow = true;
			cube.receiveShadow = true;
			scene.add(cube);
			objects.push(cube);
		}

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
		scene.add(fulcrum);
		objects.push(fulcrum);

		var seesaw = new Physijs.BoxMesh(new THREE.BoxGeometry(200, 10, 70), wood_material);
		seesaw.position.y += 45;
		seesaw.position.x += 695;
		seesaw.position.z += 200;
		seesaw.castShadow = true;
		seesaw.receiveShadow = true;
		scene.add(seesaw);
		objects.push(seesaw);

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

		// Inclined Plane
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		geometry.vertices.push(new THREE.Vector3(-50, 0, 0));
		geometry.vertices.push(new THREE.Vector3(-50, 0, -50));
		geometry.vertices.push(new THREE.Vector3(-50, 50, -50));
		geometry.vertices.push(new THREE.Vector3(0, 50, -50));
		geometry.vertices.push(new THREE.Vector3(0, 0, -50));

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

		var inclinedPlane = new Physijs.ConcaveMesh(geometry, material);
		inclinedPlane.position.x += 875;
		inclinedPlane.position.y += 10;
		inclinedPlane.position.z += 200;
		scene.add(inclinedPlane);
		objects.push(inclinedPlane);

		var dragcontrols = new THREE.DragControls(objects, camera, renderer.domElement);

		// scene.simulate();


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

		
		// Seesaw
		// var fulcrum = new Physijs.ConeMesh(new THREE.CylinderGeometry(10, 30, 30), material);
		// fulcrum.position.set(150, 15, 200);
		// fulcrum.castShadow = true;
		// fulcrum.receiveShadow = true;
		// scene.add(fulcrum);
		// objects.push(fulcrum);

		// var seesaw = new Physijs.BoxMesh(new THREE.BoxGeometry(200, 10, 70), material);
		// seesaw.position.set(145, 35, 200);
		// seesaw.castShadow = true;
		// seesaw.receiveShadow = true;
		// scene.add(seesaw);
		// objects.push(seesaw);















