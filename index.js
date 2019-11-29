import * as THREE from './lib/three.module.js';
let degree;

let statusAcce = document.getElementById('accelerometr');
if('Accelerometer' in window) {
    let AcceSensor = new Accelerometer();
    AcceSensor.addEventListener('reading', (e) => {
        statusAcce.innerHTML =  'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
    });
    AcceSensor.start();
}else {
    console.log('dont have acceleration sensor');
}

let statusGyro = document.getElementById('statusGyro');
if ( 'Gyroscope' in window ) {
  let sensorGyro = new Gyroscope();
  sensorGyro.addEventListener('reading', function(e) {
    statusGyro.innerHTML = 'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
  });
  sensorGyro.start();
}
else statusGyro.innerHTML = 'Gyroscope not supported';
//работа с освещенностью экрана
let convertLux = (lux ,minLux, maxLux, minRGB, maxRGB) => {
    return (lux - minLux) * (maxRGB - minRGB) / (maxLux - minLux) + minRGB;
}

let statusLight = document.getElementById('lightSensor');
if( 'AmbientLightSensor' in window ) {
    let sensorLight = new AmbientLightSensor();
    sensorLight.addEventListener('reading', (e) => {
        let currIlluminance = e.target.illuminance,
            rgbIlluminance;

        statusLight.innerHTML = `Current light level: ${currIlluminance}`;
        rgbIlluminance = convertLux(currIlluminance, 0, 500, 0, 255);
        document.body.style.backgroundColor = `rgb(${rgbIlluminance}, ${rgbIlluminance}, ${rgbIlluminance})`;
    });
    sensorLight.start();
} else {
    document.getElementById('lightSensor').innerHTML = 'Light sensor not support';
}
//работа с датчиком для получения значения и использовании в компасе
let statusCompas = document.getElementById('statusCompas');
if('AbsoluteOrientationSensor' in window) {
    let sensorAbsoluteOrientation = new AbsoluteOrientationSensor();
    sensorAbsoluteOrientation.addEventListener('reading', (e) => {
        let q = e.target.quaternion;
        degree =  Math.atan2(2*q[0]*q[1] + 2*q[2]*q[3], 1 - 2*q[1]*q[1] - 2*q[2]*q[2])*(180/Math.PI);
        let statusText = `degrees: ${degree}`;
        if( degree < 0) degree += 360;
        statusText += `adjusted degrees: ${degree}`;
        statusCompas.innerHTML= statusText;
    });
    sensorAbsoluteOrientation.start();
} else {
    statusCompas.innerHTML = `absoluteOrientation sensor not support`;
}

console.log(window.innerWidth, window.innerHeight);
let div3D = document.querySelector('.container3d');
//создание 3D стрелки компаса

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 75);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const geometry = new THREE.Geometry();
geometry.vertices = [
    new THREE.Vector3(0, 0, 20),
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(0, 0, -20),
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(0, 0, 20),
    new THREE.Vector3(0, 2 ,0),
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(0, 2 ,0),
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(0, 2 ,0),
    new THREE.Vector3(0, 0, -20),
];

geometry.faces = [
    new THREE.Face3(0, 5, 1), //0
    new THREE.Face3(3, 5, 4), //3
    new THREE.Face3(1, 9, 2), //1
    new THREE.Face3(2, 7, 3), //2
];

geometry.faces[0].color = geometry.faces[1].color = new THREE.Color('blue');
geometry.faces[2].color = geometry.faces[3].color = new THREE.Color('red');

const material = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
const arrow = new THREE.Mesh(geometry, material);
scene.add(arrow);

function render() {
    requestAnimationFrame(render);
    arrow.rotation.y = -degree * Math.PI / 180;
    renderer.render(scene, camera);
}
render();
