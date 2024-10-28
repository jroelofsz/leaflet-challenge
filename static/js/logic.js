let defaultCoords = [37.090240,-95.712891]
let mapElement = "map"

//Create map object
let myMap = L.map(mapElement,{
    center: defaultCoords,
    zoom: 4
})

//add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function chooseColor(feature) {
    if (feature <= 20) {
        return "#00FF00"; // Green
    } else if (feature <= 40) {
        return "#66FF00"; // Yellow-Green
    } else if (feature <= 60) {
        return "#FFFF00"; // Yellow
    } else if (feature <= 80) {
        return "#FF9900"; // Orange
    } else if (feature <= 100) {
        return "#900000"; // Red
    } else {
        return "#FF0000"; // Default color if no cases match
    }
}

//API link
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(link).then(
    function(data) {
        L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng,{
                    color: "white",
                    fillColor: chooseColor(feature.geometry.coordinates[2]),
                    fillOpacity: .8,
                    weight: 1.5,
                    radius: Math.sqrt(feature.properties.mag)  + Math.sqrt(feature.properties.sig)  // You can adjust this radius to control marker size
                });
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(
                    `<h2>Magnitude: ${feature.properties.mag}</h2>
                     <h2>Location: ${feature.properties.place}</h2>
                     <h3>Depth: ${feature.geometry.coordinates[2]}
                    `
                );
            }
        }).addTo(myMap);
    let legend = L.control({position: 'bottomright'})
    
    legend.onAdd = function(){
        let div = L.DomUtil.create('div','legend')

        div.style.backgroundColor = "white"
        div.style.padding = '10px'
        div

        let depths = [-10, 10, 30, 50, 70, 90]
        let colors = ["#00FF00","#66FF00","#FFFF00","#FF9900","#900000","#FF0000"]
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                `<i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ` +
                `${depths[i]} ${depths[i + 1] ? "&ndash; " + depths[i + 1] : "+"}<br>`;
        }

        return div;
    };
    legend.addTo(myMap)
});
