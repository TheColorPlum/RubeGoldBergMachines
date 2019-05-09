function Particle(x, y, z, mass) {
  this.position = new THREE.Vector3(); // position
  this.previous = new THREE.Vector3(); // previous
  this.original = new THREE.Vector3(); // original
  initParameterizedPosition(x, y, this.position);
  initParameterizedPosition(x, y, this.previous);
  initParameterizedPosition(x, y, this.original);

  this.netForce = new THREE.Vector3(); // net force acting on particle
  this.mass = mass; // mass of the particle
}

Particle.prototype.lockToOriginal = function() {
  this.position.copy(this.original);
  this.previous.copy(this.original);
};

Particle.prototype.lock = function() {
  this.position.copy(this.previous);
  this.previous.copy(this.previous);
};

Particle.prototype.addForce = function(force) {
  // ----------- STUDENT CODE BEGIN ------------
  // Add the given force to the particle's total netForce.
  // ----------- Our reference solution uses 1 lines of code.
  this.netForce.add(force);
  // ----------- STUDENT CODE END ------------
};

Particle.prototype.integrate = function(deltaT) {
  // ----------- STUDENT CODE BEGIN ------------
  // Perform Verlet integration on this particle with the provided
  // timestep deltaT.
  //
  // You need to:
  // (1) Save the old (i.e. current) position into this.previous.
  // (2) Compute the new position of this particle using Verlet integration,
  //     and store it into this.position.
  // (3) Reset the net force acting on the particle (i.e. make it (0, 0, 0) again).
  // ----------- Our reference solution uses 13 lines of code.
  // xt+dt=xt+(1−D)*(x_t−x_t−dt)+at*dt^2
  let vdt = this.position.clone();
  vdt.sub(this.previous);
  vdt.multiplyScalar(1 - 0.03);
  let adt2 = this.netForce.clone();
  adt2.divideScalar(this.mass);
  adt2.multiplyScalar(deltaT * deltaT);
  let newguy = this.position.clone().add(adt2).add(vdt);
  this.previous = this.position;
  this.position = newguy;
  this.netForce = new THREE.Vector3();
  // ----------- STUDENT CODE END ------------
};

Particle.prototype.handleFloorCollision = function() {
  // ----------- STUDENT CODE BEGIN ------------
  // Handle collision of this particle with the floor.
  // ----------- Our reference solution uses 3 lines of code.
  let y = this.position.y;
  if (y < -249.0) this.position.setY(-249.0);
  // ----------- STUDENT CODE END ------------
};

Particle.prototype.handleSphereCollision = function() {
  if (sphere.visible) {
    // ----------- STUDENT CODE BEGIN ------------
    // Handle collision of this particle with the sphere.
    let posFriction = new THREE.Vector3();
    let posNoFriction = new THREE.Vector3();
    // ----------- Our reference solution uses 28 lines of code.
    // If particle is inside sphere
    let check = this.position.clone().sub(spherePosition);
    //let dist = spherePosition.distanceTo(this.position);

    if (check.length() <= sphereSize){
      // Projection onto surface
      posNoFriction = check.normalize().multiplyScalar(sphereSize);
      posNoFriction.add(spherePosition);

      let prevCheck = spherePosition.clone().sub(prevSpherePosition);
      let prevDist = spherePosition.distanceTo(this.previous);
      if(prevDist > sphereSize){
        // Adjust the particle’s previous position by the same motion that the sphere made in the last timestep
        posFriction = prevCheck.add(this.previous);
        // posFriction * F + posNoFriction * (1 - F)
        this.position = posFriction.multiplyScalar(friction).add(posNoFriction.multiplyScalar(1 - friction));
      }
      else {
        this.position = posNoFriction;
      }
    }
    // ----------- STUDENT CODE END ------------
  }
};




Particle.prototype.handleBoxCollision = function() {
  if (box.visible) {
    // ----------- STUDENT CODE BEGIN ------------
    // Handle collision of this particle with the axis-aligned box.
    let posFriction = new THREE.Vector3();
    let posNoFriction = new THREE.Vector3();
    // ----------- Our reference solution uses 61 lines of code.

    if (boundingBox.containsPoint(this.position)){
      // Box coorindates
      let minX = boundingBox.min.x;
      let maxX = boundingBox.max.x;
      let minY = boundingBox.min.y;
      let maxY = boundingBox.max.y;
      let minZ = boundingBox.min.z;
      let maxZ = boundingBox.max.z;

      // Current coordinates
      let x = this.position.x;
      let y = this.position.y;
      let z = this.position.z;

      // Find distances
      let top = Math.abs(maxY - y);
      let bottom = Math.abs(minY - y);
      let left = Math.abs(minX - x);
      let right = Math.abs(maxX - x);
      let near = Math.abs(minZ - z);
      let far = Math.abs(maxZ - z);
      let closest = Number.MAX_VALUE;
      let position = this.position;
      

      if (closest > top){
        posNoFriction = new THREE.Vector3(x, maxY, z);
        closest = top;
      }
      if (closest > bottom){
        posNoFriction = new THREE.Vector3(x, minY, z);
        closest = bottom;
      }  
      if (closest > left){
        posNoFriction = new THREE.Vector3(minX, y, z);
        closest = left;
      } 
      if (closest > right){
        posNoFriction = new THREE.Vector3(maxX, y, z);
        closest = right;
      } 
      if (closest > near){
        posNoFriction = new THREE.Vector3(x, y, minZ);
        closest = near;
      }
      if (closest > far){
        posNoFriction = new THREE.Vector3(x, y, maxZ);
        closest = far;
      } 

      if(!boundingBox.containsPoint(this.previous)){
        posFriction = this.previous.clone();
        this.position = posFriction.multiplyScalar(friction).add(posNoFriction.multiplyScalar(1 - friction));
      }
      else{
        this.position = posNoFriction;
      }
    }
    // ----------- STUDENT CODE END ------------
  }
};
