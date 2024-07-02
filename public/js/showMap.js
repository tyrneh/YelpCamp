mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 7, // starting zoom
});

// adding a pin
const marker = new mapboxgl.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${camp.title}</h4><p>${camp.description}</p>`
    )
  )
  .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
