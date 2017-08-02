let fireflies = [];

var Colors = {
  red:0xf25346,
  white:0xd8d0d1,
  brown:0x59332e,
  pink:0xF5986E,
  brownDark:0x23190f,
  blue:0x122654,
};

window.addEventListener('load', init, false);
var clock = new THREE.Clock();
var firstControls;
var time;
var i, materials = [], geometry, parameters;

function init() {
  // set up the scene, the camera and the renderer
  createScene();

  // add the lights
  createLights();

  // add the objects

  createSea();

  createMoon();
  createFirefly();
  createStars();
  // createSky();

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  loop();
}

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

function createScene() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera
  // and the size of the renderer.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  // Add a fog effect to the scene; same color as the background color used in the style sheet
  scene.fog = new THREE.Fog(0x370059, 100, 850);

  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 70;
  nearPlane = 0.1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(fieldOfView,	aspectRatio, nearPlane, farPlane);
  // camera.lookAt(scene.position);

  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;
  // camera.rotation.y = Math.PI *2 ;

  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  // it will fill the entire screen
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
  window.addEventListener('resize', handleWindowResize, false);

  var controls = new THREE.VRControls(this.camera);
  firstControls = new THREE.FirstPersonControls( camera );
    controls.standing = true;
    this.camera.position.y = 100;
    firstControls.movementSpeed = 500;
    firstControls.lookSpeed = 0.1;
    // this.camera.position.y = controls.userHeight;

    var mouseControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    mouseControls.addEventListener('change', this.renderer.render(scene, this.camera));
    mouseControls.enablePan = false;
    mouseControls.enableDamping = true;
    mouseControls.dampingFactor = 0.25;
    mouseControls.enableZoom = false;
}


function handleWindowResize() {
// update height and width of the renderer and the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);

  // Set the direction of the light
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, just add them to the scene
  // scene.add(hemisphereLight);
  scene.add(shadowLight);
}


var sea;

function createSea(){
  sea = new Sea();

  // push it a little bit at the bottom of the scene
  sea.mesh.position.y = 50;

  // add the mesh of the sea to the scene
  scene.add(sea.mesh);
}


function createMoon(){
  var geom = new THREE.SphereGeometry(70,32,32);
    var mat = new THREE.MeshBasicMaterial({ color: 0xfff954});

    var moon = new THREE.Mesh(geom, mat);
    moon.position.x = 0;
    moon.position.y = 220;
    moon.position.z = -180;
    // Allow the sea to receive shadows
    var pointLight = new THREE.PointLight( 0xfff954, 2, 600 );
    moon.add( pointLight );
    moon.receiveShadow = false;
    scene.add(moon);

  // var dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
  // dirLight.position.x = 0;
  // dirLight.position.y = 100;
  // dirLight.position.z = 100;
  // // dirLight.position.set( 0, -1, 0 ).normalize();
  // scene.add( dirLight );
  // dirLight.color.setHSL( 0.1, 0.7, 0.5 );
  //
  addLight( 0.55, 0.9, 0.5, 5000, 0, -1000 );
  addLight( 0.08, 0.8, 0.5, 0, 400, -600 );
  // addLight( 0.995, 0.5, 0.9, 5000, 5000, -1000 );
}

function addLight( h, s, l, x, y, z ) {
  var moon = new THREE.PointLight( 0xffffff, 1.5, 3000 );
  moon.color.setHSL( h, s, l );
  moon.position.set( x, y, z );
  scene.add( moon );
}

function createStars(){

  geometry = new THREE.Geometry();

  parameters = [
    [ [1, 1, 0.5], 1 ],
    [ [0.95, 1, 0.5], 1 ],
    [ [0.90, 1, 0.5], 1 ],
    [ [0.85, 1, 0.5], 1 ],
    [ [0.80, 1, 0.5], 1 ]
  ];

  for ( i = 0; i < 1000; i ++ ) {

    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 2000-1000;
    vertex.y = Math.random() * 2000-1000;
    vertex.z = Math.random() * 2000-1000;

    geometry.vertices.push( vertex );

  }

  for ( i = 0; i < parameters.length; i ++ ) {

    color = 0xffffff;
    size  = parameters[i][1];

    materials[i] = new THREE.PointsMaterial( { color: 0xffffff, size: 2, sizeAttenuation: false } );

    particles = new THREE.Points( geometry, materials[i] );

    // particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.position.y = Math.random() * 6 + 600;//?????
    particles.rotation.z = Math.random() * 6;

    scene.add( particles );

  }
}


function createFirefly(){
    const randSpread = pos => THREE.Math.randFloatSpread(pos);
    const rand = (min, max) => THREE.Math.randFloat(min, max);

    for (let i = 0; i < 80; i += 1) {
      const firefly = new Fly({
        light: true,
        bodyColor: 0x5363B2,
        wingColor: 0xA9B8FC,
        lightColor: 0x00FFA5,
      });
      firefly.group.position.set(randSpread(400), rand(300), randSpread(200));

      const scale = rand(0.2, 0.4);
      firefly.group.scale.set(scale, scale, scale);

      scene.add(firefly.group);
      fireflies.push(firefly);
    }
}


function loop(){
  requestAnimationFrame(loop);
  const timer = 0.00001 * Date.now();
  var delta = clock.getDelta();
  time = clock.getElapsedTime() * 10;
  firstControls.update( delta );

  fireflies.forEach((firefly, index) => {
    const xPos = ( 1000 * Math.cos(timer + index)) + 150;
    const yPos = 30 * Math.sin(timer * index) + 150;
    const zPos = -100 * Math.sin(timer + index);
    firefly.group.position.set(xPos, yPos, zPos);
  });
  sea.moveWaves();
  renderer.render(scene, camera);

}

class Fly {
  constructor({ light, lightColor }) {
    this.group = new THREE.Group();

    if (light) {
      this.lightColor = lightColor;
      this.drawLight();
    }
  }

  drawLight() {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    geometry.castShadow = false;
    const flyLight = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: this.lightColor,
      // shading: THREE.FlatShading,
    }));
    // flyLight.rotation.y = 45 * (Math.PI / 180);

    const light = new THREE.AmbientLight(this.lightColor, 0.01, 0.5);
    light.add(flyLight);
    // light.position.set(0, -12, 0);
    light.castShadow = false;
    this.group.add(light);
  }
}



Sea = function(){ //=function Sea(){}
  var geom = new THREE.PlaneGeometry(1000,1000,20,20,10,10);
  // var geom = new THREE.BoxGeometry(1000,600,800,20,10,10);

  // geom.position.y = 300;
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

  // important: by merging vertices we ensure the continuity of the waves
  geom.mergeVertices();

  // get the vertices
  var l = geom.vertices.length;

  // create an array to store new data associated to each vertex
  this.waves = [];

  for (var i=0; i<l; i++){
    // get each vertex
    var v = geom.vertices[i];

    // store some data associated to it
    this.waves.push({y:v.y,
                     x:v.x,
                     z:v.z,
                     // a random angle
                     ang:Math.random()*Math.PI*2,
                     // a random distance
                     amp:5 + Math.random()*15,
                     // a random speed between 0.016 and 0.048 radians / frame
                     speed:0.016 + Math.random()*0.032
                    });
  };
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.blue,
    transparent:true,
    opacity:.9,
    shading:THREE.FlatShading,
  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;


}

// now we create the function that will be called in each frame
// to update the position of the vertices to simulate the waves

Sea.prototype.moveWaves = function (){

  // get the vertices
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;

  for (var i=0; i<l; i++){
    var v = verts[i];

    // get the data associated to it
    var vprops = this.waves[i];

    // update the position of the vertex
    v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

    // for ( var i = 0; i < l; i ++ ) {
    //
    //   v.x = vprops.x + 100* Math.sin(i / 5 + ( time + i ) / 7)*vprops.amp;
    //
    // }


  // geometry.vertices[ i ].y =  100* Math.sin( i / 5 + ( time + i ) / 7 );

    // increment the angle for the next frame
    vprops.ang += vprops.speed;

  }

  // Tell the renderer that the geometry of the sea has changed.
  // In fact, in order to maintain the best level of performance,
  // three.js caches the geometries and ignores any changes
  // unless we add this line
  this.mesh.geometry.verticesNeedUpdate=true;

  // sea.mesh.rotation.z += .001;
}
