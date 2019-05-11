		Physijs.scripts.worker = './js/physijs_worker.js';
		Physijs.scripts.ammo = '../ammo.js';

		var width = window.innerWidth;
		var height = window.innerHeight;

		var scene = new Physijs.Scene;
		
		scene.addEventListener( 'update', function() {
			//your code. physics calculations have done updating
		});
		
	    var ground_material = Physijs.createMaterial(
			new THREE.MeshPhongMaterial( { color: 0x008080, flatShading: true } ),0, .9 // low restitution
		);
		// Playground
		var ground = new Physijs.BoxMesh(new THREE.BoxGeometry(2000, 1, 2000),ground_material,0 // mass
		);
		ground.receiveShadow = true;
		ground.position.x -=450;
		scene.add(ground);


		// Machine Space
		var ground_material2 = Physijs.createMaterial(
			new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ),0, .9 // low restitution
		);
		var machineSpace = new Physijs.BoxMesh(new THREE.BoxGeometry(400, 1, 750),ground_material2,0 // mass
		);
		machineSpace.receiveShadow = true;
		machineSpace.position.y += 10;
		machineSpace.position.x +=250;
		scene.add(machineSpace);

	    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);

	    camera.position.y = 160;
		camera.position.z = 400;

		scene.add(camera);

	    var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
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


		//DOMINO FIRST thank you
		for(var i = 0; i < 100; i++) {
			var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
			var domino = new Physijs.BoxMesh(new THREE.BoxGeometry(70, 140, 35), material);
			domino.position.y += 80;
			domino.position.x += 150;
			domino.position.z -= 200;
			domino.castShadow = true;
			domino.receiveShadow = true;
			scene.add(domino);
			objects.push(domino);
		}

		

		//ball next thank you
		for(var i = 0; i < 100; i++) {
			var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
			var ball = new Physijs.SphereMesh(new THREE.SphereGeometry(30, 30, 30 ), material);
			ball.position.y += 40;
			ball.position.x += 150;
			ball.castShadow = true;
			ball.receiveShadow = true;
			scene.add(ball);
			objects.push(ball);
		}

		// Large Cube
		for(var i = 0; i < 100; i++) {
			var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
			var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(120, 120, 120), material, 0);
			cube.position.z -= 200;
			cube.position.y += 70;
			cube.position.x += 300;
			cube.castShadow = true;
			cube.receiveShadow = true;
			scene.add(cube);
			objects.push(cube);
		}

		// Medium Cube
		for(var i = 0; i < 100; i++) {
			var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
			var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 60, 60), material, 0);
			cube.position.y += 40;
			cube.position.x += 300;
			cube.castShadow = true;
			cube.receiveShadow = true;
			scene.add(cube);
			objects.push(cube);
		}

		// Small Cube
		for(var i = 0; i < 100; i++) {
			var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
			var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(30, 30, 30), material, 0);
			cube.position.z += 100;
			cube.position.y += 25;
			cube.position.x += 300;
			cube.castShadow = true;
			cube.receiveShadow = true;
			scene.add(cube);
			objects.push(cube);
		}

		// SeeSaw
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
		var fulcrum = new Physijs.ConeMesh(new THREE.CylinderGeometry(10, 30, 30), material);
		fulcrum.position.x += 150;
		fulcrum.position.y += 25;
		fulcrum.position.z += 200;
		fulcrum.castShadow = true;
		fulcrum.receiveShadow = true;
		scene.add(fulcrum);
		objects.push(fulcrum);

		var seesaw = new Physijs.BoxMesh(new THREE.BoxGeometry(200, 10, 70), material);
		seesaw.position.y += 45;
		seesaw.position.x += 145;
		seesaw.position.z += 200;
		seesaw.castShadow = true;
		seesaw.receiveShadow = true;
		scene.add(seesaw);
		objects.push(seesaw);

		var dragcontrols = new THREE.DragControls(objects, camera, renderer.domElement);

		// scene.simulate();
		
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
		var fulcrum = new Physijs.ConeMesh(new THREE.CylinderGeometry(10, 30, 30), material);
		fulcrum.position.x += 150;
		fulcrum.position.y += 15;
		fulcrum.position.z += 200;
		fulcrum.castShadow = true;
		fulcrum.receiveShadow = true;
		scene.add(fulcrum);
		objects.push(fulcrum);

		var seesaw = new Physijs.BoxMesh(new THREE.BoxGeometry(200, 10, 70), material);
		seesaw.position.y += 35;
		seesaw.position.x += 145;
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
















