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

	    camera.position.y = 500;
		camera.position.z = 1000;

		scene.add(camera);

	    var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		document.body.appendChild(renderer.domElement);

		var clock = new THREE.Clock;

		// Orbit controls
		var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
		orbitControls.enableKeys = false;

		function render() {
			orbitControls.update();
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

		// All object
		var objects = [];

		//DOMINO FIRST thank you
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
		var domino = new Physijs.BoxMesh(new THREE.BoxGeometry(70, 140, 35), material);
		domino.position.y += 80;
		domino.position.x += 150;
		domino.position.z -= 200;
		domino.castShadow = true;
		domino.receiveShadow = true;
		scene.add(domino);
		objects.push(domino);

		

		//ball next thank you
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
		var ball = new Physijs.SphereMesh(new THREE.SphereGeometry(30, 30, 30 ), material);
		ball.position.y += 40;
		ball.position.x += 150;
		ball.castShadow = true;
		ball.receiveShadow = true;
		scene.add(ball);
		objects.push(ball);

		// Large Cube
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
		var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(120, 120, 120), material, 0);
		cube.position.z -= 200;
		cube.position.y += 70;
		cube.position.x += 300;
		cube.castShadow = true;
		cube.receiveShadow = true;
		scene.add(cube);
		objects.push(cube);

		// Medium Cube
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
		var cubeM = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 60, 60), material, 0);
		cubeM.position.y += 40;
		cubeM.position.x += 300;
		cubeM.castShadow = true;
		cubeM.receiveShadow = true;
		scene.add(cubeM);
		objects.push(cubeM);

		// Small Cube
		var material = new THREE.MeshPhongMaterial({ color: 0xb76e79, flatShading: true });
		var cubeS = new Physijs.BoxMesh(new THREE.BoxGeometry(30, 30, 30), material, 0);
		cubeS.position.z += 100;
		cubeS.position.y += 25;
		cubeS.position.x += 300;
		cubeS.castShadow = true;
		cubeS.receiveShadow = true;
		scene.add(cubeS);
		objects.push(cubeS);

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
		inclinedPlane.position.x += 325;
		inclinedPlane.position.y += 10;
		inclinedPlane.position.z += 200;
		scene.add(inclinedPlane);
		objects.push(inclinedPlane);

		for (var i = 0; i < objects.length; i++) {
			if (i != 3) {
				continue;
			}
			var transformControls = new THREE.TransformControls(camera, renderer.domElement);    
			transformControls.addEventListener('change', render);
			transformControls.attach(objects[i]);
			transformControls.addEventListener('mouseDown', function () {
				orbitControls.enabled = false;
			});
			transformControls.addEventListener('mouseUp', function () {
				orbitControls.enabled = true;
			});
			scene.add(transformControls);
		}
		// scene.simulate();



		// Pendulum Functions
		// var rigidBodies = [];
		// var margin = 0.05;

		// function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {
  //       	threeObject.position.copy( pos );
  //       	threeObject.quaternion.copy( quat );
		// 	var transform = new Ammo.btTransform();
		// 	transform.setIdentity();
		// 	transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
		// 	transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
		// 	var motionState = new Ammo.btDefaultMotionState( transform );
		// 	var localInertia = new Ammo.btVector3( 0, 0, 0 );
	 //    	physicsShape.calculateLocalInertia( mass, localInertia );
	 //    	var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
	 //    	var body = new Ammo.btRigidBody( rbInfo );
		// 	threeObject.userData.physicsBody = body;
		// 	scene.add( threeObject );
		// 	if ( mass > 0 ) {
		// 		rigidBodies.push( threeObject );
		// 		// Disable deactivation
		// 		body.setActivationState( 4 );
		// 	}
		// 	physicsWorld.addRigidBody( body );
  //       }

		// Swing
		var swingMass = 1.2;
		var swingRadius = 50;
		var swing = new Physijs.SphereMesh( new THREE.SphereGeometry( swingRadius, 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x202020, flatShading: true } ) );
		swing.castShadow = true;
		swing.receiveShadow = true;
		// var ballShape = new Ammo.btSphereShape( ballRadius );
		// ballShape.setMargin(0.05);
		// var pos = new THREE.Vector3( -3, 2, 0 );
		// var quat = new THREE.Quaternion( 0, 0, 0, 1 );
		// createRigidBody( ball, ballShape, ballMass, pos, quat );
		// ball.userData.physicsBody.setFriction( margin );
		swing.position.set(150, 70, -200);
		swing.castShadow = true;
		swing.receiveShadow = true;
		scene.add(swing);
		

		/* When the user clicks on the button, 
		toggle between hiding and showing the dropdown content */
		function myFunction() {
			document.getElementById("myDropdown").classList.toggle("show");
		}
		
		// Close the dropdown menu if the user clicks outside of it
		window.onclick = function(event) {
			if (!event.target.matches('.dropbtn')) {
			var dropdowns = document.getElementsByClassName("dropdown-content");
			var i;
			for (i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
				}
			}
			}
		}
















