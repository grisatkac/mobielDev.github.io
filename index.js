const geoBtn = document.querySelector('#geo_btn');
const devPos = document.querySelector('#devPos');


window.addEventListener('deviceorientation', (event) => {
    /*console.log(`absolute: ${event.absolute}`);
    console.log(`apha: ${event.alpha}`)*/
    document.querySelector('#absolute').innerHTML = `absolute: ${event.absolute} \n`;
    document.querySelector('#alpha').innerHTML = `alpha: ${event.alpha} \n`;
    document.querySelector('#beta').innerHTML = `beta: ${event.beta} \n`;
    document.querySelector('#gamma').innerHTML = `gamma: ${event.gamma} \n`;
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
});
