// File: geotagging.js

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    var latInput = document.getElementById("tagging_latitude");
    var longInput = document.getElementById("tagging_longitude");
    var latInputDiscovery = document.getElementById("discovery_latitude");
    var longInputDiscovery = document.getElementById("discovery_longitude");
    var lat = latInput.value ? parseFloat(latInput.value) : null;
    var long = longInput.value ? parseFloat(longInput.value) : null;

    if (lat !== null && long !== null) {
        updateMap(lat, long);
    } else {
        LocationHelper.findLocation((locHelper) => {
            var lat = parseFloat(locHelper.latitude);
            var long = parseFloat(locHelper.longitude);
            latInput.setAttribute('value', lat);
            longInput.setAttribute('value', long);
            latInputDiscovery.setAttribute('value', lat);
            longInputDiscovery.setAttribute('value', long);
            updateMap(lat, long);
        });
    }
}

function updateMap(lat, long) {
    taglist_json = document.getElementById("map").getAttribute("data-tags");
    var tags = JSON.parse(taglist_json);

    var mapManager = new MapManager();
    mapManager.initMap(lat, long);
    mapManager.updateMarkers(lat, long, tags);

    const discoveryMapDiv = document.querySelector('.discovery__map');

    if (discoveryMapDiv) {
        const mapViewElement = discoveryMapDiv.querySelector('#mapView');
        if (mapViewElement) {
            mapViewElement.remove();
        }
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
/*
var btnTagging = document.getElementById("tagging_button");
var btnDiscovery = document.getElementById("discovery_button");

btnTagging.addEventListener("click", updateMap());
btnDiscovery.addEventListener("click", updateMap());

function updateMap() {

    var latInput = document.getElementById("tagging_latitude").getAttribute("value");
    var longInput = document.getElementById("tagging_longitude").getAttribute("value");

    console.log("Latitude:", latInput);
    console.log("Longitude:", longInput);

    //var tags = [{ location: { latitude: latInput, longitude: longInput }, name: "Your Location" }];
    
    taglist_json = document.getElementById("map").getAttribute("data-tags");
    var tags = JSON.parse(taglist_json);
    
    var mapManager = new MapManager();
    mapManager.initMap(latInput, longInput);
    mapManager.updateMarkers(latInput, longInput, tags);

}
*/
