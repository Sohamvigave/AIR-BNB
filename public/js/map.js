mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates) // listing.geometry.coordinates
    .addTo(map);
