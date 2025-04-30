mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates || [77.216721, 28.6448], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 10, // starting zoom
});


map.on("load", () => {

    new mapboxgl.Marker({ color : 'red'})
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h4>${title}</h4><p>Exact location will be provided after booking!</p>`
      )
  )
  .addTo(map);
});




