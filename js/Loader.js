var camera, scene, renderer;

var width = document.getElementById("renderView").clientWidth;
if(document.documentElement.clientHeight > 600) height = 200 + document.documentElement.clientHeight - 600;
else height = 200;

init();

function init() {

  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x999999, 1));

  camera = new THREE.PerspectiveCamera(35, width / height , 1, 500);

  // Z is up for objects intended to be 3D printed.

  camera.up.set(0, 0, 1);
  camera.position.set(0, -12, 6);

  camera.add(new THREE.PointLight(0xffffff, 3));

  scene.add(camera);

  var grid = new THREE.GridHelper(25, 50, 0xffffff, 0x555555);
  grid.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 * (Math.PI / 180));
  scene.add(grid);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x999999);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  document.getElementById("renderView").appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.target.set(0, 1.2, 2);
  controls.update();
  window.addEventListener('resize', onWindowResize, false);

}

function load(filePath, scene) {

  var loader = new THREE.STLLoader();


  // Binary files

  var material = new THREE.MeshPhongMaterial({ color: 0x0e2045, specular: 0x111111, shininess: 0, side: THREE.DoubleSide });
  loader.load(filePath, function (geometry) {
    var mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.set(0, 0, 0);

    boundingBox = new THREE.Box3().setFromObject(mesh);
    scaleFactor = [10 / boundingBox.max.x, 10 / boundingBox.max.y, 6 / boundingBox.max.z];
    scaleMin = Math.min(...scaleFactor);

    mesh.scale.set(scaleMin, scaleMin, scaleMin);
    mesh.position.set(0, 0, boundingBox.max.z * scaleMin / 2);

    geometry.center();

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.children[3] = mesh;
    render();
  });
}

function onWindowResize() {
  width = document.getElementById("renderView").clientWidth;
  if(document.documentElement.clientHeight > 600) height = 200 + document.documentElement.clientHeight - 600;
  else height = 200;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  render();

}

function render() {

  renderer.render(scene, camera);

}
