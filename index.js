const geoBtn = document.querySelector('#geo_btn');
const vibBtn = document.querySelector('#vib_btn');

geoBtn.addEventListener('click', () => {
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
});

vibBtn.addEventListener('click', () => {
    navigator.vibrate(2000);
})
