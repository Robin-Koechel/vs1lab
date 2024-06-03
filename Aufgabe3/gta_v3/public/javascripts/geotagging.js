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

    var tags = [{  location:{latitude: lat, longitude: long} , name: "Your Location" }];

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
