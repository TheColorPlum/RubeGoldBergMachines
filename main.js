		Physijs.scripts.worker = './js/physijs_worker.js';
		Physijs.scripts.ammo = '../ammo.js';

		var width = window.innerWidth;
		var height = window.innerHeight;

		var scene = new Physijs.Scene;
		
		scene.addEventListener( 'update', function() {
			//your code. physics calculations have done updating
		});
		
	    var ground_material = Physijs.createMaterial(
			new THREE.MeshStandardMaterial( { color: 0x00ff00 } ),0, .9 // low restitution
		);
		// Ground
		var ground = new Physijs.BoxMesh(new THREE.BoxGeometry(750, 1, 750),ground_material,0 // mass
		);
		ground.receiveShadow = true;
		scene.add( ground );

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
		controls.enablePan = false;
		controls.enableZoom = true;

		function render() {
			controls.update();
			renderer.render(scene, camera);
    		requestAnimationFrame(render);
		}
 
		render();

		camera.lookAt(ground.position);

		var pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(0, 300, 200);
		 
		scene.add(pointLight);


		// Lets add some shapes!
		var domino = new Physijs.BoxMesh(new THREE.BoxGeometry(70, 140, 35));
		scene.add(domino);