// set the precision of the float values (necessary if using float)
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
precision mediump int;

// flag for using soft shadows
#define SOFT_SHADOWS 0

// define constant parameters
// EPS is for the precision issue
#define INFINITY 1.0e+12
#define EPS 1.0e-3

// define maximum recursion depth for rays
#define MAX_RECURSION 8

// define constants for scene setting
#define MAX_LIGHTS 10

// define texture types
#define NONE 0
#define CHECKERBOARD 1
#define MYSPECIAL 2

// define material types
#define BASICMATERIAL 1
#define PHONGMATERIAL 2
#define LAMBERTMATERIAL 3

// define reflect types - how to bounce rays
#define NONEREFLECT 1
#define MIRRORREFLECT 2
#define GLASSREFLECT 3

struct Shape {
  int shapeType;
  vec3 v1;
  vec3 v2;
  float rad;
};

struct Material {
  int materialType;
  vec3 color;
  float shininess;
  vec3 specular;

  int materialReflectType;
  float reflectivity;
  float refractionRatio;
  int special;
};

struct Object {
  Shape shape;
  Material material;
};

struct Light {
  vec3 position;
  vec3 color;
  float intensity;
  float attenuate;
};

struct Ray {
  vec3 origin;
  vec3 direction;
};

struct Intersection {
  vec3 position;
  vec3 normal;
};

// uniform
uniform mat4 uMVMatrix;
uniform int frame;
uniform float height;
uniform float width;
uniform vec3 camera;
uniform int numObjects;
uniform int numLights;
uniform Light lights[MAX_LIGHTS];
uniform vec3 objectNorm;

// varying
varying vec2 v_position;

// find then position some distance along a ray
vec3 rayGetOffset(Ray ray, float dist) {
  return ray.origin + (dist * ray.direction);
}

// if a newly found intersection is closer than the best found so far, record
// the new intersection and return true; otherwise leave the best as it was and
// return false.
bool chooseCloserIntersection(float dist, inout float best_dist,
                              inout Intersection intersect,
                              inout Intersection best_intersect) {
  if (best_dist <= dist)
    return false;
  best_dist = dist;
  best_intersect.position = intersect.position;
  best_intersect.normal = intersect.normal;
  return true;
}

// put any general convenience functions you want up here
// ----------- STUDENT CODE BEGIN ------------
// ----------- Our reference solution uses 114 lines of code.
// ----------- STUDENT CODE END ------------

// forward declaration
float rayIntersectScene(Ray ray, out Material out_mat,
                        out Intersection out_intersect);

// Plane
// this function can be used for plane, triangle, and box
float findIntersectionWithPlane(Ray ray, vec3 norm, float dist,
                                out Intersection intersect) {
  float a = dot(ray.direction, norm);
  float b = dot(ray.origin, norm) - dist;

  if (a < EPS && a > -EPS)
    return INFINITY;

  float len = -b / a;
  if (len < EPS)
    return INFINITY;

  intersect.position = rayGetOffset(ray, len);
  intersect.normal = norm;
  return len;
}

// Checks if intersection point is within triangle
bool triangleHelper(vec3 t1, vec3 t2, vec3 P, Ray ray){
  // V1 = T1 - P
  vec3 V1 = t1 - P;
  // V2 = T2 - P
  vec3 V2 = t2 - P;
  // N1 = V2 x V1
  vec3 N = cross(V2, V1);
  // if (V • N1 < 0)
  if (dot(ray.direction, N) < 0.0) return false;
  else return true;
}

// Triangle
float findIntersectionWithTriangle(Ray ray, vec3 t1, vec3 t2, vec3 t3,
                                   out Intersection intersect) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 28 lines of code.
  // Normal n = (r−b) × (s−b)
  vec3 N = cross(t2 - t1, t3 - t1);
  N = normalize(N);
  // D = P⋅N
  float D = dot(ray.direction + ray.origin, N);
  float t = findIntersectionWithPlane(ray, N, D, intersect);
  if (t < EPS || t > INFINITY) return INFINITY;
  // Check that t is within triangle
  bool test1 = triangleHelper(t1, t2, intersect.position, ray);
  bool test2 = triangleHelper(t2, t3, intersect.position, ray);
  bool test3 = triangleHelper(t3, t1, intersect.position, ray);

  if (test1 == false || test2 == false || test3 == false) return INFINITY;
  else return t;
  // currently reports no intersection
  // return INFINITY;
  // ----------- STUDENT CODE END ------------
}

// Finds normal and sets intersection
void sphereHelper(Ray ray, vec3 center, float len, out Intersection intersect){
  // N = (P - O) / ||P - O||
  // P = P0 + tV
  vec3 PO = ray.origin + len * ray.direction - center;
  vec3 norm = PO / length(PO);
  intersect.position = rayGetOffset(ray, len);
  intersect.normal = norm;
}

// Sphere
float findIntersectionWithSphere(Ray ray, vec3 center, float radius,
                                 out Intersection intersect) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 25 lines of code.
  // L = O - P0
  vec3 L = center - ray.origin;
  // tca = L dot V
  float tca = dot(L, ray.direction);
  if (tca < EPS) return INFINITY;
  // d^2 = L dot L - tca^2
  float d2 = dot(L, L) - tca * tca;
  if (d2 > radius * radius) return INFINITY;
  // thc = sqrt(r^2 - d^2)
  float thc = sqrt(radius * radius - d2);
  float t1 = tca - thc;
  float t2 = tca + thc;

  // If both too big
  if (t1 >= INFINITY && t2 >= INFINITY) return INFINITY;
  // If both too small
  else if (t1 <= EPS && t2 <= EPS) return INFINITY;
  // If t1 too big and t2 too small
  else if (t1 >= INFINITY && t2 <= EPS) return INFINITY;
  // If t1 too small and t2 too big
  else if (t1 <= EPS && t2 >= INFINITY) return INFINITY;
  // If t1 out of bounds
  else if (t1 >= INFINITY || t1 <= EPS){
    sphereHelper(ray, center, t2, intersect);
    return t2;
  }
  // If t2 out of bounds
  else if (t2 >= INFINITY || t2 <= EPS){
    sphereHelper(ray, center, t1, intersect);
    return t1;
  }
  else {
    float min = min(t1, t2);
    //if (t1 == t2) min = t1;
    sphereHelper(ray, center, min, intersect);
    return min;
  }
  // currently reports no intersection
  //return INFINITY;
  // ----------- STUDENT CODE END ------------
}

// Box Helper Function
bool isInside(vec3 min, vec3 max, vec3 p){
  float xmin = min.x - EPS;
  float ymin = min.y - EPS;
  float zmin = min.z - EPS;
  float xmax = max.x + EPS;
  float ymax = max.y + EPS;
  float zmax = max.z + EPS;
  // x is out of bounds
  if (p.x < xmin || p.x > xmax) return false;
  // y is out of bounds
  if (p.y < ymin || p.y > ymax) return false;
  // z is out of bounds
  if (p.z < zmin || p.z > zmax) return false;
  else return true;
}

// Box
float findIntersectionWithBox(Ray ray, vec3 pmin, vec3 pmax,
                              out Intersection out_intersect) {
  // ----------- STUDENT CODE BEGIN ------------
  // pmin and pmax represent two bounding points of the box
  // pmin stores [xmin, ymin, zmin] and pmax stores [xmax, ymax, zmax]
  // ----------- Our reference solution uses 44 lines of code.
  // Define 6 face normals
  vec3 norm1 = vec3(1.0, 0.0, 0.0);
  vec3 norm2 = vec3(0.0, 1.0, 0.0);
  vec3 norm3 = vec3(0.0, 0.0, 1.0);
  vec3 norm4 = -norm1;
  vec3 norm5 = -norm2;
  vec3 norm6 = -norm3;

  vec3 R = ray.direction + ray.origin;
  float D1 = pmax.x;
  float D2 = pmax.y;
  float D3 = pmax.z;
  float D4 = -pmin.x;
  float D5 = -pmin.y;
  float D6 = -pmin.z;

  Intersection i1;
  Intersection i2;
  Intersection i3;
  Intersection i4;
  Intersection i5;
  Intersection i6;

  float t1 = findIntersectionWithPlane(ray, norm1, D1, i1);
  float t2 = findIntersectionWithPlane(ray, norm2, D2, i2);
  float t3 = findIntersectionWithPlane(ray, norm3, D3, i3);
  float t4 = findIntersectionWithPlane(ray, norm4, D4, i4);
  float t5 = findIntersectionWithPlane(ray, norm5, D5, i5);
  float t6 = findIntersectionWithPlane(ray, norm6, D6, i6);

  float best = INFINITY;

  if (isInside(pmin, pmax, i1.position) && t1 > EPS && t1 < INFINITY) chooseCloserIntersection(t1, best, i1, out_intersect);
  if (isInside(pmin, pmax, i2.position) && t2 > EPS && t2 < INFINITY) chooseCloserIntersection(t2, best, i2, out_intersect);
  if (isInside(pmin, pmax, i3.position) && t3 > EPS && t3 < INFINITY) chooseCloserIntersection(t3, best, i3, out_intersect);
  if (isInside(pmin, pmax, i4.position) && t4 > EPS && t4 < INFINITY) chooseCloserIntersection(t4, best, i4, out_intersect);
  if (isInside(pmin, pmax, i5.position) && t5 > EPS && t5 < INFINITY) chooseCloserIntersection(t5, best, i5, out_intersect);
  if (isInside(pmin, pmax, i6.position) && t6 > EPS && t6 < INFINITY) chooseCloserIntersection(t6, best, i6, out_intersect);
  // currently reports no intersection
  return best;
  // ----------- STUDENT CODE END ------------
}

// Cylinder
float getIntersectOpenCylinder(Ray ray, vec3 center, vec3 axis, float len,
                               float rad, out Intersection intersect) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 33 lines of code.
  // d⃗ = p⃗ − p⃗_a
  vec3 d = ray.origin - center;
  
  vec3 v = ray.direction;
  vec3 vvA = (v - dot(v, axis) * axis);
  // A = (v⃗ −(v⃗ ⋅v⃗_a)v⃗_a)^2
  float A = pow(length(vvA), 2.0);
  vec3 dvA = (d - dot(d, axis) * axis);
  // B = 2 * (v⃗ −(v⃗ ⋅v⃗_a)v⃗_a)⋅(d⃗ −(d⃗ ⋅v⃗_a)v⃗_a)
  float B = 2.0 * dot(vvA, dvA);
  // C = (d⃗ −(d⃗ ⋅v⃗_a)v⃗_a)2−r^2
  float C = pow(length(dvA), 2.0) - pow(rad, 2.0);

  float det = (B * B) - (4.0 * A * C);

  if (det < EPS) return INFINITY;

  float t1 = (-B - sqrt(det)) / (2.0 * A);
  float t2 = (-B + sqrt(det)) / (2.0 * A);

  float test = 0.0;
  if (t1 > EPS) test = t1;
  else if (t2 > EPS) test = t2;
  else return INFINITY;

  vec3 offset = rayGetOffset(ray, test);
  vec3 diff = offset - center;
  if (dot(axis, diff) <= EPS) return INFINITY;
  if (dot(axis, diff - axis * len) >= EPS) return INFINITY;

  intersect.position = offset;
  intersect.normal = normalize(offset - (dot(diff, axis) * axis + center));

  return test;
  // ----------- STUDENT CODE END ------------
}

float getIntersectDisc(Ray ray, vec3 center, vec3 norm, float rad,
                       out Intersection intersect) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 18 lines of code.
  // currently reports no intersection
  float D = dot(center, norm);
  float len = findIntersectionWithPlane(ray, norm, D, intersect);
  vec3 R = ray.origin + ray.direction * len;
  if (distance(R, center) > rad) return INFINITY;
  else return len;
  // ----------- STUDENT CODE END ------------
}

float findIntersectionWithCylinder(Ray ray, vec3 center, vec3 apex,
                                   float radius,
                                   out Intersection out_intersect) {
  vec3 axis = apex - center;
  float len = length(axis);
  axis = normalize(axis);

  Intersection intersect;
  float best_dist = INFINITY;
  float dist;

  // -- infinite cylinder
  dist = getIntersectOpenCylinder(ray, center, axis, len, radius, intersect);
  chooseCloserIntersection(dist, best_dist, intersect, out_intersect);

  // -- two caps
  dist = getIntersectDisc(ray, center, -axis, radius, intersect);
  chooseCloserIntersection(dist, best_dist, intersect, out_intersect);
  dist = getIntersectDisc(ray, apex, axis, radius, intersect);
  chooseCloserIntersection(dist, best_dist, intersect, out_intersect);
  return best_dist;
}

// Cone
float getIntersectOpenCone(Ray ray, vec3 apex, vec3 axis, float len,
                           float radius, out Intersection intersect) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 45 lines of code.
  // d⃗ = p⃗ − p⃗_a
  vec3 d = ray.origin - apex; 
  vec3 v = ray.direction;
  vec3 vvA = (v - dot(v, axis) * axis);
  vec3 dvA = (d - dot(d, axis) * axis);
  float alpha = atan(radius / len);

  float A = pow(cos(alpha), 2.0) * pow(length(vvA), 2.0) - pow(sin(alpha), 2.0) * pow(dot(v, axis), 2.0);
  float B = 2.0 * pow(cos(alpha), 2.0) * dot(vvA, dvA) - 2.0 * pow(sin(alpha), 2.0) * dot(v, axis) * dot(d, axis);
  float C = pow(cos(alpha), 2.0) * pow(length(dvA), 2.0) - pow(sin(alpha), 2.0) * pow(dot(d, axis), 2.0);

  float det = (B * B) - (4.0 * A * C);

  if (det < EPS) return INFINITY;

  float t1 = (-B - sqrt(det)) / (2.0 * A);
  float t2 = (-B + sqrt(det)) / (2.0 * A);

  float test = 0.0;
  if (t1 > EPS) test = t1;
  else if (t2 > EPS) test = t2;
  else return INFINITY;

  vec3 offset = rayGetOffset(ray, test);
  vec3 diff = offset - apex;
  if (dot(axis, diff) <= EPS) return INFINITY;
  if (dot(axis, diff - axis * len) >= EPS) return INFINITY;

  intersect.position = offset;
  intersect.normal = normalize(offset - (dot(diff, axis) * axis + apex));

  return test;
  // currently reports no intersection
  //return INFINITY;
  // ----------- STUDENT CODE END ------------
}

float findIntersectionWithCone(Ray ray, vec3 center, vec3 apex, float radius,
                               out Intersection out_intersect) {
  vec3 axis = center - apex;
  float len = length(axis);
  axis = normalize(axis);

  // -- infinite cone
  Intersection intersect;
  float best_dist = INFINITY;
  float dist;

  // -- infinite cone
  dist = getIntersectOpenCone(ray, apex, axis, len, radius, intersect);
  chooseCloserIntersection(dist, best_dist, intersect, out_intersect);

  // -- caps
  dist = getIntersectDisc(ray, center, axis, radius, intersect);
  chooseCloserIntersection(dist, best_dist, intersect, out_intersect);

  return best_dist;
}

vec3 calculateSpecialDiffuseColor(Material mat, vec3 posIntersection,
                                  vec3 normalVector) {
  // ----------- STUDENT CODE BEGIN ------------
  if (mat.special == CHECKERBOARD) {
    // ----------- Our reference solution uses 7 lines of code.
    // Use floor() to determine color
    float x = posIntersection.x;
    float z = posIntersection.z;
    float y = posIntersection.y;
    float test = floor(x + EPS) + floor(z + EPS) + floor(y + EPS);
    vec3 zero = vec3(0.0, 0.0, 0.0);
    vec3 one = vec3(1.0, 1.0, 1.0);  
    if (mod(test, 2.0) >= 1.0) return zero;
    else return one;
  } else if (mat.special == MYSPECIAL) {
    // ----------- Our reference solution uses 5 lines of code.
    float x = posIntersection.x;
    float y = posIntersection.y;
    float dist = sqrt(x * x + y * y);
    vec3 add = vec3(0.25, 0.25, 0.25);
    if (dist < 8.3) return vec3(0.0, x / 25.0, y / 25.0) + add;
    else if (dist < 16.6) return vec3(y / 25.0, 0.0, x / 25.0) + add;
    else if (dist < 24.0) return vec3(x / 25.0, y / 25.0, 0.0) + add;
    else if (dist < 32.3) return vec3(0.0, y / 50.0, x / 25.0) + add;
    else if (dist < 40.6) return vec3(x / 25.0, 0.0, y / 25.0) + add;
    else return vec3(y / 25.0, x / 25.0, 0.0) + add;  
  } 

  // If not a special material, just return material color.
  return mat.color;
  // ----------- STUDENT CODE END ------------
}

vec3 calculateDiffuseColor(Material mat, vec3 posIntersection,
                           vec3 normalVector) {
  // Special colors
  if (mat.special != NONE) {
    return calculateSpecialDiffuseColor(mat, posIntersection, normalVector);
  }
  return vec3(mat.color);
}

// check if position pos in in shadow with respect to a particular light.
// lightVec is the vector from that position to that light -- it is not
// normalized, so its length is the distance from the position to the light
bool pointInShadow(vec3 pos, vec3 lightVec) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 15 lines of code.
  // Create ray
  Ray ray;
  ray.origin = pos;
  ray.direction = normalize(lightVec);

  // Check for intersection
  Material mat;
  Intersection intersect;
  float test = rayIntersectScene(ray, mat, intersect);

  // If in bounds return false
  if (abs(test) < EPS || abs(test) >= length(lightVec)) return false;

  // If blocked or out of bounds return true
  return true;
  // ----------- STUDENT CODE END ------------
}

// use random sampling to compute a ratio that represents the
// fractional contribution of the light to the position pos.
// lightVec is the vector from that position to that light -- it is not
// normalized, so its length is the distance from the position to the light
float softShadowRatio(vec3 pos, vec3 lightVec) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 1 lines of code.
  return 0.0;
  // ----------- STUDENT CODE END ------------
}

vec3 getLightContribution(Light light, Material mat, vec3 posIntersection,
                          vec3 normalVector, vec3 eyeVector, bool phongOnly,
                          vec3 diffuseColor) {
  vec3 lightVector = light.position - posIntersection;

  // check if point is in shadow with light vector
  if (pointInShadow(posIntersection, lightVector)) {
    return vec3(0.0, 0.0, 0.0);
  }

  // normalize the light vector for the computations below
  float distToLight = length(lightVector);
  lightVector /= distToLight;

  if (mat.materialType == PHONGMATERIAL ||
      mat.materialType == LAMBERTMATERIAL) {
    vec3 contribution = vec3(0.0, 0.0, 0.0);

    // get light attenuation
    float attenuation = light.attenuate * distToLight;
    float diffuseIntensity =
        max(0.0, dot(normalVector, lightVector)) * light.intensity;

    // glass and mirror objects have specular highlights but no diffuse lighting
    if (!phongOnly) {
      contribution +=
          diffuseColor * diffuseIntensity * light.color / attenuation;
    }

    if (mat.materialType == PHONGMATERIAL) {
      // Start with just black by default (i.e. no Phong term contribution)
      vec3 phongTerm = vec3(0.0, 0.0, 0.0);
      // ----------- STUDENT CODE BEGIN ------------
      // ----------- Our reference solution uses 6 lines of code.
      // cos(alpha) = V dot R
      vec3 R = reflect(-lightVector, normalVector);
      float alpha = dot(normalize(eyeVector), normalize(R));
      alpha = max(0.0, alpha);
      // I_L = I_0 / (c + ld + qd^2)
      // c = l = 0
      float I_L = light.intensity / attenuation;
      // k_s is a specular reflection constant
      // the ratio of reflection of the specular term of incoming light
      // n is shininess
      // I_s = K_s (V × R)^n I_Li
      phongTerm = mat.specular * pow(alpha, mat.shininess) * I_L;
      // ----------- STUDENT CODE END ------------
      contribution += phongTerm;
    }

    return contribution;
  } else {
    return diffuseColor;
  }
}

vec3 calculateColor(Material mat, vec3 posIntersection, vec3 normalVector,
                    vec3 eyeVector, bool phongOnly) {
  // The diffuse color of the material at the point of intersection
  // Needed to compute the color when accounting for the lights in the scene
  vec3 diffuseColor = calculateDiffuseColor(mat, posIntersection, normalVector);

  // color defaults to black when there are no lights
  vec3 outputColor = vec3(0.0, 0.0, 0.0);

  // Loop over the MAX_LIGHTS different lights, taking care not to exceed
  // numLights (GLSL restriction), and accumulate each light's contribution
  // to the point of intersection in the scene.
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 9 lines of code.
  // Return diffuseColor by default, so you can see something for now.
  for (int i = 0; i < MAX_LIGHTS; i++){
    if (i < numLights){
      vec3 contribution = getLightContribution(lights[i], mat, posIntersection, normalVector, 
        eyeVector, phongOnly, diffuseColor);
      outputColor += contribution;
    }
  }
  return outputColor;
  //return diffuseColor;
  // ----------- STUDENT CODE END ------------
}

// find reflection or refraction direction (depending on material type)
vec3 calcReflectionVector(Material material, vec3 direction, vec3 normalVector,
                          bool isInsideObj) {
  if (material.materialReflectType == MIRRORREFLECT) {
    return reflect(direction, normalVector);
  }
  // If it's not mirror, then it is a refractive material like glass.
  // Compute the refraction direction.
  // See lecture 13 slide (lighting) on Snell's law.
  // The eta below is eta_i/eta_r.
  // ----------- STUDENT CODE BEGIN ------------
  float eta =
      (isInsideObj) ? 1.0 / material.refractionRatio : material.refractionRatio;

  // dot product is the angle between two vectors
  // 
  float theta1 = dot(-direction, normalVector);
  float theta2 = cos(asin(eta * sin(acos(theta1))));
  vec3 T = (eta * theta1 - theta2) * normalVector - eta * -direction;
  return T;

  // ----------- Our reference solution uses 5 lines of code.
  // Return mirror direction by default, so you can see something for now.
  //return reflect(direction, normalVector);
  // ----------- STUDENT CODE END ------------
}

vec3 traceRay(Ray ray) {
  // Accumulate the final color from tracing this ray into resColor.
  vec3 resColor = vec3(0.0, 0.0, 0.0);

  // Accumulate a weight from tracing this ray through different materials
  // based on their BRDFs. Initially all 1.0s (i.e. scales the initial ray's
  // RGB color by 1.0 across all color channels). This captures the BRDFs
  // of the materials intersected by the ray's journey through the scene.
  vec3 resWeight = vec3(1.0, 1.0, 1.0);

  // Flag for whether the ray is currently inside of an object.
  bool isInsideObj = false;

  // Iteratively trace the ray through the scene up to MAX_RECURSION bounces.
  for (int depth = 0; depth < MAX_RECURSION; depth++) {
    // Fire the ray into the scene and find an intersection, if one exists.
    //
    // To do so, trace the ray using the rayIntersectScene function, which
    // also accepts a Material struct and an Intersection struct to store
    // information about the point of intersection. The function returns
    // a distance of how far the ray travelled before it intersected an object.
    //
    // Then, check whether or not the ray actually intersected with the scene.
    // A ray does not intersect the scene if it intersects at a distance
    // "equal to zero" or far beyond the bounds of the scene. If so, break
    // the loop and do not trace the ray any further.
    // (Hint: You should probably use EPS and INFINITY.)
    // ----------- STUDENT CODE BEGIN ------------
    Material hitMaterial;
    Intersection intersect;

    float test = rayIntersectScene(ray, hitMaterial, intersect);
    if (test < EPS || test >= INFINITY) { 
      break;
    }
    // Trace the ray into the scene 
    // ----------- Our reference solution uses 4 lines of code.
    // ----------- STUDENT CODE END ------------

    // Compute the vector from the ray towards the intersection.
    vec3 posIntersection = intersect.position;
    vec3 normalVector    = intersect.normal;

    vec3 eyeVector = normalize(ray.origin - posIntersection);

    // Determine whether we are inside an object using the dot product
    // with the intersection's normal vector
    if (dot(eyeVector, normalVector) < 0.0) {
        normalVector = -normalVector;
        isInsideObj = true;
    } else {
        isInsideObj = false;
    }

    // Material is reflective if it is either mirror or glass in this assignment
    bool reflective = (hitMaterial.materialReflectType == MIRRORREFLECT ||
                       hitMaterial.materialReflectType == GLASSREFLECT);

    // Compute the color at the intersection point based on its material
    // and the lighting in the scene
    vec3 outputColor = calculateColor(hitMaterial, posIntersection,
      normalVector, eyeVector, reflective);

    // A material has a reflection type (as seen above) and a reflectivity
    // attribute. A reflectivity "equal to zero" indicates that the material
    // is neither reflective nor refractive.

    // If a material is neither reflective nor refractive...
    // (1) Scale the output color by the current weight and add it into
    //     the accumulated color.
    // (2) Then break the for loop (i.e. do not trace the ray any further).
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 4 lines of code.
    if (hitMaterial.reflectivity < EPS){
      outputColor *= resWeight;
      resColor += outputColor;
      break;
    }
    // ----------- STUDENT CODE END ------------

    // If the material is reflective or refractive...
    // (1) Use calcReflectionVector to compute the direction of the next
    //     bounce of this ray.
    // (2) Update the ray object with the next starting position and
    //     direction to prepare for the next bounce. You should modify the
    //     ray's origin and direction attributes. Be sure to normalize the
    //     direction vector.
    // (3) Scale the output color by the current weight and add it into
    //     the accumulated color.
    // (4) Update the current weight using the material's reflectivity
    //     so that it is the appropriate weight for the next ray's color.
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 8 lines of code.
    //else {
    vec3 newDirection = calcReflectionVector(hitMaterial, ray.direction, normalVector, isInsideObj);
    // Normalize the direction vector
    newDirection = normalize(newDirection);
    ray.direction = newDirection;
    // Update ray origin
    ray.origin = posIntersection;
    // Update colors
    outputColor *= resWeight;
    resColor += outputColor;
    // Update weight
    resWeight *= hitMaterial.reflectivity;
    //}
    // ----------- STUDENT CODE END ------------
  }

  return resColor;
}

void main() {
  float cameraFOV = 0.8;
  vec3 direction = vec3(v_position.x * cameraFOV * width / height,
                        v_position.y * cameraFOV, 1.0);

  Ray ray;
  ray.origin = vec3(uMVMatrix * vec4(camera, 1.0));
  ray.direction = normalize(vec3(uMVMatrix * vec4(direction, 0.0)));

  // trace the ray for this pixel
  vec3 res = traceRay(ray);

  // paint the resulting color into this pixel
  gl_FragColor = vec4(res.x, res.y, res.z, 1.0);
}
