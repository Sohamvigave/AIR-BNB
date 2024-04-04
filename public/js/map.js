mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [73.9580, 17.2378], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
