import * as THREE from './lib/three.module.js';
let degree;

let statusAcce = document.getElementById('accelerometr');
let statusSide = document.getElementById('statusSide');
if('Accelerometer' in window) {
    let AcceSensor = new Accelerometer();
    AcceSensor.addEventListener('reading', (e) => {
        statusAcce.innerHTML =  'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
        if(e.target.z >= 9.76 && e.target.z <= 9.91 && Math.abs(e.target.y) <= 0.2) {
            statusSide.style.color = 'green';
            statusSide.innerHTML = 'Поверхность без наклонений';
        } else {
            statusSide.style.color = 'red';
            statusSide.innerHTML = 'Поверхность находится под наклоном';
        }
    });
    AcceSensor.start();
}else {
    console.log('dont have acceleration sensor');
}

let acceleration = document.getElementById('linear-acceleration');
let currentSpeed = document.getElementById('current-speed');
if('LinearAccelerationSensor' in window) {
    function caclulateCurrentSpeed (x, y, z) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    }
    let linearAcceleration = new LinearAccelerationSensor();
    linearAcceleration.addEventListener('reading', (e) => {
        acceleration.innerHTML = 'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
        /*currentSpeed.innerHTML = `current speed: ${caclulateCurrentSpeed(e.target.x, e.target.y, e.target.z)}`;*/
        currentSpeed.innerHTML = `${Math.sqrt(Math.pow(e.target.x, 2), Math.pow(e.target.y, 2), Math.pow(e.target.z, 2))}`
    });
    linearAcceleration.start();
} else {
    console.log('LinearAccelerationSensor not supported');
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

if('Magnetometer' in window) {
    let statusMagnetometer = document.getElementById('statusMagnetometer');
    let sensorMagnet = new Magnetometer();
    sensorMagnet.addEventListener('reading', (e) => {
        let valueForCompass = Math.atan2(e.target.y, e.target.x) * (180 / Math.PI);
        valueForCompass = valueForCompass - 90;
        if (valueForCompass < 0) valueForCompass = 360 + valueForCompass;
        statusMagnetometer.innerHTML = `Value for compass of magnetometer sensor: ${valueForCompass};`
    });
    sensorMagnet.start();
} else {
    statusMagnetometer.innerHTML = 'Magnetometr not supported';
}

/*let sensor = new AmbientLightSensor({frequency: 1});

sensor.addEventListener('reading', getValueFromSensor);

function getValueFromSensor() {
    //Действия со значениям датчика
}

sensor.start();

sensor.stop();*/

let sensor = new AbsoluteOrientationSensor();
sensor.addEventListener('reading', (e) => {
    let value = e.target.quaternion;
});



/*let statusLight = document.getElementById('lightSensor');
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
}*/
//работа с датчиком для получения значения и использовании в компасе
let statusCompas = document.getElementById('statusCompas');
let absoluteDirections = document.getElementById('absolute-direction');
if('AbsoluteOrientationSensor' in window) {
    let sensorAbsoluteOrientation = new AbsoluteOrientationSensor();
    sensorAbsoluteOrientation.addEventListener('reading', (e) => {
        let q = e.target.quaternion;
        let absoluteDegree = 0;
        degree =  Math.atan2(2*q[0]*q[1] + 2*q[2]*q[3], 1 - 2*q[1]*q[1] - 2*q[2]*q[2])*(180/Math.PI);
        /*let statusText = `degrees: ${degree}`;*/
        absoluteDirections.innerHTML = `x: ${q[0]} <br/> y: ${q[1]} <br/> z: ${q[2]} <br/> w: ${q[3]}`;
        if( degree < 0) {
            absoluteDegree = degree;
            statusCompas.innerHTML= `degrees: ${Math.abs(absoluteDegree)}`;
        } else if( degree >= 0) {
            absoluteDegree = degree;
            statusCompas.innerHTML= `degrees: ${360 - absoluteDegree}`;
        }
        
        /*statusText += `adjusted degrees: ${degree}`;*/
        statusCompas.innerHTML= `degrees: ${Math.abs(absoluteDegree)}`;
    });
    sensorAbsoluteOrientation.start();
} else {
    statusCompas.innerHTML = `absoluteOrientation sensor not support`;
}

let relativeDirections = document.getElementById('relative-direction');
if('RelativeOrientationSensor' in window) {
    let sensorRelativeOrientation = new RelativeOrientationSensor();
    sensorRelativeOrientation.addEventListener('reading', (e) => {
        let q = e.target.quaternion;
        relativeDirections.innerHTML = `x: ${q[0]} <br/> y: ${q[1]} <br/> z: ${q[2]} <br/> w: ${q[3]}`;
    })
    sensorRelativeOrientation.start();
} else {
    relativeDirections.innerHTML = 'relaiveOrientation sensor not support';
}

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


let inputField = document.getElementById('inputText');

inputField.addEventListener('keyup', (e) => {
    
    if(e.keyCode == 78) {
        e.target.selectionStart += 1;
    }

    if(e.keyCode == 80) {
        console.log('previous');
        e.target.selectionStart -= 1;
        e.target.selectionEnd -= 1;
    }
    console.log(`pointer at: ${e.target.selectionStart}`);
})

inputField.addEventListener('click', (e) => {
    
    
})