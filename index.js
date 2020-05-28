let sensor = new LinearAccelerationSensor();
sensor.addEventListener('reading', (e) => {
    let value = `x: ${e.target.x}, y: ${e.target.y}, z: ${e.target.z}`;
});

import * as THREE from './lib/three.module.js';
let degree;

let statusAcce = document.getElementById('accelerometr');
let statusSide = document.getElementById('statusSide');

let statusInput = document.getElementById('statusInput');

/* lean
let positionXAceelerometer = 0;
let startPositionInFocus = 0;
*/
/*
let inputField = document.getElementById('inputField');
inputField.addEventListener('focus', (e) => {
    startPositionInFocus = positionXAceelerometer;
    statusInput.innerHTML = 'focus';
    
});

inputField.addEventListener('blur', (e) => {
    statusInput.innerHTML = 'not focus';
    
});*/

if('Accelerometer' in window) {
    let AcceSensor = new Accelerometer();
    let currentPosition = 0;
    let previousPosition = 0;
    let direction = {
        movementReverse: false, //reverse/false
        rightDirection: false, // true/false
        leftDirection: false, // true/false
    }

    let inputField = document.getElementById('inputField');
    

    let inputLength = inputField.value.length;
    
    let directionStatus = document.getElementById('direction');
    let lean = document.getElementById('lean');
    AcceSensor.addEventListener('reading', (e) => {
        statusAcce.innerHTML =  'x: ' + e.target.x.toFixed(5) + '<br> y: ' + e.target.y.toFixed(5) + '<br> z: ' + e.target.z.toFixed(5);
        /* ровность поверхности */
        if(e.target.z >= 9.76 && e.target.z <= 9.91 && Math.abs(e.target.y) <= 0.1) {
            statusSide.style.color = 'green';
            statusSide.innerHTML = 'Поверхность без наклонений';
        } else {
            statusSide.style.color = 'red';
            statusSide.innerHTML = 'Поверхность находится под наклоном';
        }
        /* наклон курсора */
        /*lean
        positionXAceelerometer = e.target.x.toFixed(5);
        if (startPositionInFocus !=0) {
            if( positionXAceelerometer > startPositionInFocus + 0.5 || 
                positionXAceelerometer < startPositionInFocus - 0.5 ) {
                    startPositionInFocus = positionXAceelerometer;
                }
        }

        if( Math.abs(currentPosition) < 1 && direction.movementReverse === 'reverse' ) {
            if( direction.rightDirection ) {
                ....
                direction.movementReverse = false;
            }

        }
        */

        currentPosition = e.target.x;

        if( Math.abs(currentPosition) < 1 && direction.movementReverse === 'reverse' ) {
            if( direction.rightDirection ) {
                /*alert('сдвиг курсора влево');*/
                direction.movementReverse = false;
                inputLength -= 1;
                inputField.focus();
                inputField.setSelectionRange(inputLength, inputLength);

            }

            if( direction.rightDirection ) {
                /*alert('сдвиг курсора вправо');*/
                direction.movementReverse = false;
                inputLength += 1;
                inputField.focus();
                inputField.setSelectionRange(inputLength, inputLength);
            }
        }
        
        if( Math.abs(Math.abs(currentPosition) - Math.abs(previousPosition)) < 0.10 ||
            Math.abs(currentPosition) > 5.5) {
            directionStatus.innerHTML = 'Просто погрешность ввиду колебаний системы';
            previousPosition = currentPosition;
        } else if( currentPosition > previousPosition ) {
            if( direction.rightDirection ) {
                direction.rightDirection = false;
                /*direction.lean = 'reverse';*/
                direction.movementReverse = 'reverse';
                directionStatus.innerHTML = 'Поворот';
            } else {
                direction.leftDirection = true;
                /*direction.rightDirection = false;*/
                directionStatus.innerHTML = 'Наклон влево';
            }
            previousPosition = currentPosition;
            
            
        } else if ( currentPosition < previousPosition ) {
            if ( direction.leftDirection ) {
                direction.leftDirection = false;
                /*direction.lean = 'reverse';*/
                direction.movementReverse = 'reverse';
                directionStatus.innerHTML = 'Поворот';
            } else {
                direction.rightDirection = true;
                /*direction.leftDirection = false;*/
                directionStatus.innerHTML = 'Наклон вправо';
            }
            previousPosition = currentPosition;
            
        }

        lean.innerHTML = `left direction: ${direction.leftDirection} ,
                        right direction: ${direction.rightDirection} ,
                        move: ${direction.movementReverse}`;
    });
    AcceSensor.start();
}else {
    console.log('dont have acceleration sensor');
}

let acceleration = document.getElementById('linear-acceleration');
let currentSpeedField = document.getElementById('current-speed');
let maxSpeedField = document.getElementById('max-speed');
if('LinearAccelerationSensor' in window) {
    function caclulateCurrentSpeed (x, y, z) {
        return (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2))*1000/3600).toFixed(5);
    }
    let maxSpeed = 0;
    let currentSpeed = 0;
    let linearAcceleration = new LinearAccelerationSensor();
    linearAcceleration.addEventListener('reading', (e) => {
        currentSpeed = caclulateCurrentSpeed(e.target.x, e.target.y, e.target.z);
        if ( maxSpeed < currentSpeed ) {
            maxSpeed = currentSpeed;
        }
        acceleration.innerHTML = 'x: ' + e.target.x.toFixed(5) + '<br> y: ' + e.target.y.toFixed(5) + '<br> z: ' + e.target.z.toFixed(5);
        currentSpeedField.innerHTML = `current speed: ${currentSpeed}км/ч`;
        /*currentSpeed.innerHTML = `current speed: ${Math.sqrt((Math.pow(e.target.x, 2)+ Math.pow(e.target.y, 2)+ Math.pow(e.target.z, 2))*1000/3600).toFixed(5)}км/ч`;*/
        maxSpeedField.innerHTML = `max speed: ${maxSpeed}км/ч`;
    });
    linearAcceleration.start();
} else {
    console.log('LinearAccelerationSensor not supported');
}

let statusGyro = document.getElementById('statusGyro');
if ( 'Gyroscope' in window ) {
  let sensorGyro = new Gyroscope();
  sensorGyro.addEventListener('reading', function(e) {
    statusGyro.innerHTML = 'x: ' + e.target.x.toFixed(5) + '<br> y: ' + e.target.y.toFixed(5) + '<br> z: ' + e.target.z.toFixed(5);
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
/*
let sensor = new AbsoluteOrientationSensor();

sensor.addEventListener('reading', (e) => {
    let value = e.target.quaternion;
});*/



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
        absoluteDirections.innerHTML = `x: ${q[0].toFixed(5)} <br/> y: ${q[1].toFixed(5)} <br/> z: ${q[2].toFixed(5)} <br/> w: ${q[3].toFixed(5)}`;
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
        relativeDirections.innerHTML = `x: ${q[0].toFixed(5)} <br/> y: ${q[1].toFixed(5)} <br/> z: ${q[2].toFixed(5)} <br/> w: ${q[3].toFixed(5)}`;
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


/*let inputField = document.getElementById('inputField');

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
    
    
})*/
let moveCursor = document.getElementById('moveCursor');
let inputField = document.getElementById('inputField');


moveCursor.addEventListener('click', () => {
    inputField.focus();
    inputField.setSelectionRange(5, 5);
});

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