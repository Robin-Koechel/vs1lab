// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A class to help using the HTML5 Geolocation API.
 */
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

    /**
    * Create LocationHelper instance if coordinates are known.
    * @param {string} latitude 
    * @param {string} longitude 
    */
    constructor(latitude, longitude) {
        this.#latitude = (parseFloat(latitude)).toFixed(5);
        this.#longitude = (parseFloat(longitude)).toFixed(5);
    }

    /**
     * The 'findLocation' method requests the current location details through the geolocation API.
     * It is a static method that should be used to obtain an instance of LocationHelper.
     * Throws an exception if the geolocation API is not available.
     * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
     */
    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            let helper = new LocationHelper();
            helper.#latitude = location.coords.latitude.toFixed(5);
            helper.#longitude = location.coords.longitude.toFixed(5);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
            alert(error.message)
        });
    }
}

/**
 * A class to help using the MapQuest map service.
 */
class MapManager {
    
    #apiKey = '';
    #map;
    #markers;

    /**
     * Create a new MapManager instance.
     * @param {string} apiKey Your MapQuest API Key
     */
    constructor(apiKey) {
        this.#apiKey = apiKey;
    }

    /**
     * Generate a MapQuest image URL for the specified parameters.
     * @param {number} latitude The map center latitude
     * @param {number} longitude The map center longitude
     * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
     * @param {number} zoom The map zoom, defaults to 10
     * @returns {string} URL of generated map
     */
    getMapUrl(latitude, longitude, tags = [], zoom = 10) {
        if (this.#apiKey === '') {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        let tagList = `${latitude},${longitude}|marker-start`;
        tagList += tags.reduce((acc, tag) => `${acc}||${tag.latitude},${tag.longitude}|flag-${tag.name}`, "");

        const mapQuestUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${this.#apiKey}&size=600,400&zoom=${zoom}&center=${latitude},${longitude}&locations=${tagList}`;
        console.log("Generated MapQuest URL:", mapQuestUrl);

        return mapQuestUrl;
    }

    /**
    * Initialize a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {number} zoom The map zoom, defaults to 18
    */
    initMap(latitude, longitude, zoom = 18) {
        // set up dynamic Leaflet map
        this.#map = L.map('map').setView([latitude, longitude], zoom);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors'}).addTo(this.#map);
        this.#markers = L.layerGroup().addTo(this.#map);
    }

    /**
    * Update the Markers of a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
    */
    updateMarkers(latitude, longitude, tags = []) {
        // delete all markers
        this.#markers.clearLayers();
        L.marker([latitude, longitude])
            .bindPopup("Your Location")
            .addTo(this.#markers);
        for (const tag of tags) {
            L.marker([tag.location.latitude,tag.location.longitude])
                .bindPopup(tag.name)
                .addTo(this.#markers);  
        }
    }
        
}

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation(locationHelper) {
    // Update the location and write it into the field
    var lat = locationHelper.latitude;
    var long = locationHelper.longitude;

    var taggingLatVal = document.getElementById("tagging_latitude");
    taggingLatVal.setAttribute("value", lat);
    var taggingLongVal = document.getElementById("tagging_longitude");
    taggingLongVal.setAttribute("value", long);

    var discoveryLatVal = document.getElementById("discovery_latitude");
    discoveryLatVal.setAttribute("value", lat); 
    var discoveryLongVal = document.getElementById("discovery_longitude");
    discoveryLongVal.setAttribute("value", long);

    // Update the map image
    var mapManager = new MapManager();
    var tags = [{location: {latitude: lat, longitude: long}, name: "Your location"}];

    mapManager.initMap(lat, long);
    mapManager.updateMarkers(lat, long, tags);

    const discoveryMap = document.querySelector(".discovery__map");

    if (discoveryMap) {
        const mapView = discoveryMap.querySelector("#mapView");
        if (mapView) {
            mapView.remove();
        }
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    LocationHelper.findLocation(updateLocation);
});
