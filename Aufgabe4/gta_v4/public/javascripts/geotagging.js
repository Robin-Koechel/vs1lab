// File: geotagging.js
import MapManager from "./map-manager";
// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    var latInput = document.getElementById('tagging_latitude');
    var longInput = document.getElementById('tagging_longitude');
    var latInputDiscovery = document.getElementById('discovery_latitude');
    var longInputDiscovery = document.getElementById('discovery_longitude');
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
    fetch('/api/geotags', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        var mapManager = new MapManager();  
        mapManager.initMap(lat, long);
        mapManager.updateMarkers(lat, long, data.taglist);
    }); 
}

function updateTags(lat, long, taglist) {
    const discoveryResults = document.getElementById('discoveryResults');
    discoveryResults.innerHTML = '';
    taglist.forEach(tag => {
        const list = document.createElement('li');
        list.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}), ${tag.hashtag}`;
        discoveryResults.appendChild(list);  
    });

    var mapManager = new MapManager();
    mapManager.initMap(lat, long);
    mapManager.updateMarkers(lat, long, taglist);
}

function submitTag(event) {
    event.preventDefault();
    const tagForm = document.getElementById('tag-form');
    const form = new FormData(tagForm);
    const data = {
        latitude: form.get('tagging_latitude'),
        longitude: form.get('tagging_longitude'),
        name: form.get('tagging_name'),
        hashtag: form.get('tagging_tag')
    };
    fetch('/api/geotags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        const list = document.createElement('li');
        list.textContent = `${data._name}, (${data._location.lat}, ${data._location.long}), ${data._hashtag}`;
        discoveryResults.appendChild(list);
    });
}

function submitSearch(event) {
    event.preventDefault();
    const discoveryForm = document.getElementById('discoveryFilterForm');
    const form = new FormData(discoveryForm);
    const searchParams = new URLSearchParams({
        discovery_search: form.get('discovery_search'),
        discovery_latitude: form.get('discovery_latitude'),
        discovery_longitude: form.get('discovery_longitude')
    });
    fetch(`/api/geotags?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const discoveryResults = document.getElementById('discoveryResults');
        discoveryResults.innerHTML = '';
        data.taglist.forEach(tag => {
            const list = document.createElement('li');
            list.textContent = `${tag._name}, (${tag._location.lat}, ${tag._location.long}), ${tag._hashtag}`;
            discoveryResults.appendChild(list);
        });
        
        var mapManager = new MapManager();
        mapManager.initMap(form.get('discovery_latitude'), form.get('discovery_longitude'));
        mapManager.updateMarkers(form.get('discovery_latitude'), form.get('discovery_longitude'), data.taglist);
        
    });
    
// Wait for the page to fully load  its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", (event) => {
    const tagging_field = document.getElementById('tag-form');
    const discovery_field = document.getElementById('discoveryFilterForm');
    
    tagging_field.addEventListener('submit', submitTag);
    discovery_field.addEventListener('submit', submitSearch);
    
    updateLocation();  
})};
