import * as THREE from './lib/three.module.js';
let degree;
/*
window.addEventListener('deviceorientation', (event) => {
    console.log(`absolute: ${event.absolute}`);
    console.log(`apha: ${event.alpha}`)
    document.querySelector('#absolute').innerHTML = `absolute: ${event.absolute} \n`;
    document.querySelector('#alpha').innerHTML = `alpha: ${event.alpha} \n`;
    document.querySelector('#beta').innerHTML = `beta: ${event.beta} \n`;
    document.querySelector('#gamma').innerHTML = `gamma: ${event.gamma} \n`;
});*/
/*
window.addEventListener('devicemotion', (event) => {
    console.log(`ускорение: `);
    console.log(event.acceleration);
    console.log(`ускорение по осям: `);
    console.log(event.accelerationIncludingGravity);
    console.log(`скорость изменени по осям: `);
    console.log(event.rotationRate);
    console.log(`время получения с устройства: `);
    console.log(event.interval);
    document.querySelector('#motion1').innerHTML = `ускорение: ${event.acceleration.x.toFixed(3)}, 
    ${event.acceleration.y.toFixed(3)}, ${event.acceleration.z.toFixed(3)} \n`;
    document.querySelector('#motion2').innerHTML = `ускорение по осям: ${event.accelerationIncludingGravity.x},
    ${event.acceleration.y}, ${event.acceleration.z} \n`;
    document.querySelector('#motion3').innerHTML = `скорость изменени по осям: ${event.rotationRate.alpha},
    ${event.rotationRate.beta}, ${event.rotationRate.gamma} \n`;
    document.querySelector('#motion4').innerHTML = `время получения с устройства: ${event.interval} \n`;
});

geoBtn.addEventListener('click', () => {
    if("geolocation" in navigator) {
        function havePosition(pos) {
            console.log(`x: ${pos.coords.latitude}`);
            console.log(`y: ${pos.coords.longitude}`);
            alert(`x: ${pos.coords.latitude}`);
            alert(`y: ${pos.coords.longitude}`);
        }

        function noPosition(pos) {
            console.log("device don't have geolocation sensor");
        }

        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(havePosition, noPosition, options);
    }else {
        console.log('navigation in not avaible');
    }
});*/


let AcceBtn = document.getElementById('accelerometr');
if('Accelerometer' in window) {
    let AcceSensor = new Accelerometer();
    AcceSensor.addEventListener('reading', (e) => {
        accelerometr.innerHTML =  'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
    });
    AcceSensor.start();
}else {
    console.log('dont have acceleration sensor');
}

let status = document.getElementById('status');
if ( 'Accelerometer' in window ) {
  let sensor = new Accelerometer();
  sensor.addEventListener('reading', function(e) {
    status.innerHTML = 'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
  });
  sensor.start();
}
else status.innerHTML = 'Accelerometer not supported';


let statusGyro = document.getElementById('statusGyro');
if ( 'Gyroscope' in window ) {
  let sensorGyro = new Gyroscope();
  sensorGyro.addEventListener('reading', function(e) {
    statusGyro.innerHTML = 'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
  });
  sensorGyro.start();
}
else statusGyro.innerHTML = 'Gyroscope not supported';

let convertLux = (lux ,minLux, maxLux, minRGB, maxRGB) => {
    return (lux - minLux) * (maxRGB - minRGB) / (maxLux - minLux) + minRGB;
}

let statusLight = document.getElementById('lightSensor');
/* if( 'AmbientLightSensor' in window ) {
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
}*/

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
/*div3D.style.width = `${window.innerWidth}px`;
div3D.style.height = `${window.innerHeight}px`;*/
/* main code
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 75);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
let geometry = new THREE.Geometry();

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
    new THREE.Face3(0, 1, 5),
    new THREE.Face3(3, 4, 5),
    new THREE.Face3(1, 2, 9),
    new THREE.Face3(2, 3, 7),
];

geometry.faces = [
    new THREE.Face3(0, 5, 1),
    new THREE.Face3(3, 5, 4),
    new THREE.Face3(1, 9, 2),
    new THREE.Face3(2, 7, 3),
];

let line = new THREE.Line( geometry, material);
scene.add(line);

function render() {
    requestAnimationFrame(render);
    
    renderer.render(scene, camera);
}
render();

console.log(THREE); */



/* geometry.elementsNeedUpdate = true; */

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(-1, -1,  1),  // 0
    new THREE.Vector3( 1, -1,  1),  // 1
    new THREE.Vector3(-1,  1,  1),  // 2
    new THREE.Vector3( 1,  1,  1),  // 3
    new THREE.Vector3(-1, -1, -1),  // 4
    new THREE.Vector3( 1, -1, -1),  // 5
    new THREE.Vector3(-1,  1, -1),  // 6
    new THREE.Vector3( 1,  1, -1),  // 7
  );

  /*
       6----7
      /|   /|
     2----3 |
     | |  | |
     | 4--|-5
     |/   |/
     0----1
  */

  geometry.faces.push(
     // front
     new THREE.Face3(0, 3, 2),
     new THREE.Face3(0, 1, 3),
     // right
     new THREE.Face3(1, 7, 3),
     new THREE.Face3(1, 5, 7),
     // back
     new THREE.Face3(5, 6, 7),
     new THREE.Face3(5, 4, 6),
     // left
     new THREE.Face3(4, 2, 6),
     new THREE.Face3(4, 0, 2),
     // top
     new THREE.Face3(2, 7, 6),
     new THREE.Face3(2, 3, 7),
     // bottom
     new THREE.Face3(4, 1, 0),
     new THREE.Face3(4, 5, 1),
  );

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshBasicMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44FF44,  0),
    makeInstance(geometry, 0x4444FF, -4),
    makeInstance(geometry, 0xFF4444,  4),
  ];

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

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

/* arrow.rotation.y = 270 * Math.PI / 180; */
function render() {
    requestAnimationFrame(render);
    arrow.rotation.y = -degree * Math.PI / 180;
    /*arrow.rotation.y += 0.001;
    console.log(`rotate degree: ${arrow.rotation.y}`); */
    renderer.render(scene, camera);
}
render();
