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

let statusLight = document.getElementById('lightSensor');
let statusRGB = document.getElementById('rgbValue');
if( 'AmbientLightSensor' in window ) {
    let sensorLight = new AmbientLightSensor();
    sensorLight.addEventListener('reading', (e) => {
        console.log('object light: ');
        console.log(e);
        console.log('Current light level:', e.target.illuminance);
        statusLight.innerHTML = `Current light level: ${e.target.illuminance}, typeof: ${typeof e.target.illuminance}`;
        statusRGB.innerHTML = `Current rgb value: ${e.target.illuminance.map(0, 500, 0, 255)}, typeof: ${typeof e.target.illuminance}`;
        if ( e.target.illuminance < 10 ) {
            document.body.style.backgroundColor = 'gray';
        }
    });
    sensorLight.start();
} else {
    console.log('light sensor not support');
}
