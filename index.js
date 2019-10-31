const geoBtn = document.querySelector('#geo_btn');
const devPos = document.querySelector('#devPos');


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
        let q = e.target.quaternion,
            degree =  Math.atan2(2*q[0]*q[1] + 2*q[2]*q[3], 1 - 2*q[1]*q[1] - 2*q[2]*q[2])*(180/Math.PI);
        let statusText = `degrees: ${degree}`;
        if( degree < 0) degree += 360;
        statusText += `adjusted degrees: ${degree}`;
        statusCompas.innerHTML= statusText;
    });

} else {
    statusCompas.innerHTML = `absoluteOrientation sensor not support`;
}
