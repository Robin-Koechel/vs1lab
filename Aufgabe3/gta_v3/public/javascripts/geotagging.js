// File: geotagging.js

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation(locHelper) {
    var latInput = document.getElementById("tagging_latitude");
    var longInput = document.getElementById("tagging_longitude");


    var lat = parseFloat(locHelper.latitude);
    var long = parseFloat(locHelper.longitude);


    latInput.setAttribute('value', lat);
    longInput.setAttribute('value', long);

    var latInput = document.getElementById("discovery_latitude");
    latInput.setAttribute('value', lat);

    var longInput = document.getElementById("discovery_longitude");
    longInput.setAttribute('value', long);

    console.log("Latitude:", lat);
    console.log("Longitude:", long);

    taglist_json = document.getElementById("map").getAttribute("data-tags");
    var tags = JSON.parse(taglist_json);

    var mapManager = new MapManager();
    mapManager.initMap(lat, long);
    mapManager.updateMarkers(lat, long, tags);

    const discoveryMapDiv = document.querySelector('.discovery__map');

    // Check if the <div> exists
    if (discoveryMapDiv) {
        // Find and remove the mapView element
        const mapViewElement = discoveryMapDiv.querySelector('#mapView');
        if (mapViewElement) {
            mapViewElement.remove();
        }
    }

}
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {

    var latInput = document.getElementById("tagging_latitude");

    if (latInput.getAttribute('value') == 49) {
        // Call findLocation with updateLocation as the callback
        LocationHelper.findLocation(updateLocation);
    }
});

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
