/*let sensor = new LinearAccelerationSensor();
sensor.addEventListener('reading', (e) => {
    let value = `x: ${e.target.x}, y: ${e.target.y}, z: ${e.target.z}`;
});*/

import * as THREE from './lib/three.module.js';
let degree;

let statusAcce = document.getElementById('accelerometr');
let statusSide = document.getElementById('statusSide');
const history = window.history;
let goBack = document.getElementById('goBack');

goBack.addEventListener('click', (e) => {
    history.go(-1);
});

/*let statusInput = document.getElementById('statusInput');*/

if('Accelerometer' in window) {
    let AcceSensor = new Accelerometer();
    let currentPosition = 0;
    let previousPosition = 0;
    let direction = {
        movementReverse: false, //reverse/false
        rightDirection: false, // true/false
        leftDirection: false, // true/false
    }

    let inputField = document.getElementById('inputField1');
    /*let cursor = document.getElementById('cursor');*/
    let inputLength  = 0;

    inputField.addEventListener('keyup', (e) => {
        inputLength = inputField.value.length;
    });
    
    /*let directionStatus = document.getElementById('direction');*/
    /*let lean = document.getElementById('lean');*/
    
    AcceSensor.addEventListener('reading', (e) => {
        statusAcce.innerHTML =  'x: ' + e.target.x.toFixed(5) + '<br> y: ' + e.target.y.toFixed(5) + '<br> z: ' + e.target.z.toFixed(5);

        if(e.target.z >= 9.76 && e.target.z <= 9.91 && Math.abs(e.target.y) <= 0.1) {
            statusSide.style.color = 'green';
            statusSide.innerHTML = 'Поверхность без наклонений';
        } else {
            statusSide.style.color = 'red';
            statusSide.innerHTML = 'Поверхность находится под наклоном';
        }

        currentPosition = e.target.x;

        if( Math.abs(currentPosition) < 1 && direction.movementReverse === 'reverse' ) {
            
            if( direction.rightDirection ) {
                direction.movementReverse = false;
                inputLength -= 1;
                /*inputField.focus();*/
                inputField.setSelectionRange(inputLength, inputLength);
            }
            
            if( direction.leftDirection ) {
                direction.movementReverse = false;
                inputLength += 1;
                /*inputField.focus();*/
                inputField.setSelectionRange(inputLength, inputLength);
            }
        }
        
        if( Math.abs(Math.abs(currentPosition) - Math.abs(previousPosition)) < 0.10 ||
            Math.abs(currentPosition) > 5.5) {
            previousPosition = currentPosition;
        } else if( currentPosition > previousPosition ) {
            if( direction.rightDirection ) {
                direction.rightDirection = false;
                direction.movementReverse = 'reverse';
            } else {
                direction.leftDirection = true;
            }
            previousPosition = currentPosition;
            
            
        } else if ( currentPosition < previousPosition ) {
            if ( direction.leftDirection ) {
                direction.leftDirection = false;
                direction.movementReverse = 'reverse';
            } else {
                direction.rightDirection = true;
            }
            previousPosition = currentPosition;
            
        }
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

    let direction = {
        movementReverse: false, //reverse/false
        rightDirection: false, // true/false
        falseDirection: false, // true/false
    }

    let history = window.history;


    let linearAcceleration = new LinearAccelerationSensor();
    linearAcceleration.addEventListener('reading', (e) => {
        /* calculate speed */
        currentSpeed = caclulateCurrentSpeed(e.target.x, e.target.y, e.target.z);
        if ( maxSpeed < currentSpeed ) {
            maxSpeed = currentSpeed;
        }
        /* calculate speed */
        currentPosition = e.target.x;
        if( Math.abs(currentPosition) < 1 && direction.movementReverse == 'reverse') {
            if( direction.rightDirection ) {
                /*moveField.innerHTML = 'переместить фокус на предыдущее поле';*/
                history.go(1);
                direction.movementReverse = '';
            } else {
                /*moveField.innerHTML = 'переместить фокус на следующее поле';*/
                history.back();
                direction.movementReverse = '';
            }

        }


        if ( !activeField ) {
            if ( currentPosition > 0 && currentPosition > 1 ) {
            
                if(direction.bottomDirection) {
                    direction.bottomDirection = false;
                    direction.movementReverse = 'reverse';
                }
                direction.topDirection = true;
                directionGyro.innerHTML = 'движение к себе';
                previousPosition = currentPosition;
                
                
            } else if ( currentPosition < 0 && currentPosition < -1 ) {
                
                if( direction.topDirection ) {
                    direction.topDirection = false;
                    direction.movementReverse = 'reverse';
                }
                direction.bottomDirection = true;
                directionGyro.innerHTML = 'движение от себя';
                previousPosition = currentPosition;
            }
        }

        acceleration.innerHTML = 'x: ' + e.target.x.toFixed(5) + '<br> y: ' + e.target.y.toFixed(5) + '<br> z: ' + e.target.z.toFixed(5);
        currentSpeedField.innerHTML = `current speed: ${currentSpeed}км/ч`;
        maxSpeedField.innerHTML = `max speed: ${maxSpeed}км/ч`;
    });
    linearAcceleration.start();
} else {
    console.log('LinearAccelerationSensor not supported');
}


let activeField = false,
    allFiedls = Object.values(document.querySelectorAll('input')),
    firstField = document.getElementById('inputField1'),
    nextFocus = document.getElementById('nextFocus'),
    prevFocus = document.getElementById('prevFocus');
let index = 0;
const changeFocusField = (el, event) => {
    if( event == 'change' ) {
        el.focus();
    }
    activeField = el;
};

nextFocus.addEventListener('click', (e) => {
    e.preventDefault();
    allFiedls[index+1].focus();
});

document.body.addEventListener('keyup', (e) => {
    if(e.keyCode == 78) {
        allFiedls.every((elem, index) => {
            if(elem == activeField) {
                changeFocusField(allFiedls[index+1], 'change');
                return false;
            } else {
                return true;
            }
            
        });
    }

    if(e.keyCode == 80) {
        console.log('click p');
        allFiedls.every((elem, index) => {
            if(elem == activeField) {
                console.log('change!');
                console.log('index: ', index);
                changeFocusField(allFiedls[index-1], 'change');
                return false;
            } else {
                return true;
            }
            
        });
        

    }
})

document.body.addEventListener('focusin', (e) => {
    console.log('focus in');
    changeFocusField(e.target, 'focus');
});

document.body.addEventListener('focusout', (e) => {
    console.log('focus out');
    activeField = false;
});



let statusGyro = document.getElementById('statusGyro');
if ( 'Gyroscope' in window ) {
    /*test variables*/

    let directionGyro = document.getElementById('directionGyro');
    

    /*test variables */
    let currentPosition = 0,
        previousPosition = 0,
        statusDirection = document.getElementById('statusDirection');

    let direction = {
        movementReverse: false, //reverse/false
        topDirection: false, // true/false
        bottomDirection: false, // true/false
    }

    let moveField = document.getElementById('moveField');

    let sensorGyro = new Gyroscope();
    sensorGyro.addEventListener('reading', function(e) {
        statusGyro.innerHTML = 'x: ' + e.target.x.toFixed(5) + '<br> y: ' + e.target.y.toFixed(5) + '<br> z: ' + e.target.z.toFixed(5);

        currentPosition = e.target.x;

        if( Math.abs(currentPosition) < 1 && direction.movementReverse == 'reverse') {
            if( direction.topDirection ) {
                moveField.innerHTML = 'переместить фокус на предыдущее поле';
                allFiedls.every((elem, index) => {
                    if(elem == activeField) {
                        /*if(index == 0) {
                            changeFocusField(allFiedls[allFiedls.length], 'change');
                        }*/

                        switch (index) {
                            case 0:
                                changeFocusField(allFiedls[0], 'change');
                                break;
                            
                            default:
                                changeFocusField(allFiedls[index-1], 'change');
                                break;
                        }

                        /*changeFocusField(allFiedls[index-1], 'change');*/
                        return false;
                    } else {
                        return true;
                    }
                    
                });
                direction.movementReverse = '';
            } else {
                moveField.innerHTML = 'переместить фокус на следующее поле';
                allFiedls.every((elem, index) => {
                    if(elem == activeField) {

                        switch (index) {
                            case allFiedls.length:
                                changeFocusField(allFiedls[allFiedls.length-1], 'change');
                                break;
                        
                            default:
                                changeFocusField(allFiedls[index+1], 'change');
                                break;
                        }
                        /*changeFocusField(allFiedls[index+1], 'change');*/
                        return false;
                    } else {
                        return true;
                    }
                    
                });
                direction.movementReverse = '';
            }

        }

        if ( currentPosition > 0 && currentPosition > 1 ) {
            
            if(direction.bottomDirection) {
                direction.bottomDirection = false;
                direction.movementReverse = 'reverse';
            }
            direction.topDirection = true;
            directionGyro.innerHTML = 'движение к себе';
            previousPosition = currentPosition;
            
            
        } else if ( currentPosition < 0 && currentPosition < -1 ) {
            
            if( direction.topDirection ) {
                direction.topDirection = false;
                direction.movementReverse = 'reverse';
            }
            direction.bottomDirection = true;
            directionGyro.innerHTML = 'движение от себя';
            previousPosition = currentPosition;
        }

        statusDirection.innerHTML = `top direction: ${direction.topDirection},
                                    bottom direction: ${direction.bottomDirection},
                                    direction: ${direction.movementReverse}`;
        
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
/*let moveCursor = document.getElementById('moveCursor');
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
})*/