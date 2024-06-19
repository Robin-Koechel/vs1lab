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
document.addEventListener('DOMContentLoaded', (event) => {
    
    function fetchAndUpdateTags(lat, long) {
        fetch('/api/geotags')
            .then(response => response.json())
            .then(data => {
                const taglist = data.taglist;
                const discoveryResults = document.getElementById('discoveryResults');
                discoveryResults.innerHTML = ''; // Clear previous results
                console.log(taglist);
                // Update the UI with new taglist
                taglist.forEach(tag => {
                    const li = document.createElement('li');
                    li.textContent = `${tag._name} (${tag._location.lat}, ${tag._location.long}) ${tag._hashtag}`;
                    discoveryResults.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching tags:', error));
            
            taglist_json = document.getElementById("map").getAttribute("data-tags");
            var tags = JSON.parse(taglist_json);
        
            var mapManager = new MapManager();
            mapManager.initMap(lat, long);
            mapManager.updateMarkers(lat, long, tags);

    }
    
    
    const tagForm = document.getElementById('tag-form');
    const discoveryForm = document.getElementById('discoveryFilterForm');

    // Event listener for tagging form
    tagForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevents the form from submitting

        const formData = new FormData(tagForm);
        const data = {
            latitude: formData.get('tagging_latitude'),
            longitude: formData.get('tagging_longitude'),
            name: formData.get('tagging_name'),
            hashtag: formData.get('tagging_tag')
        };

        fetch('/api/geotags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            var latInput = document.getElementById("tagging_latitude");
            var longInput = document.getElementById("tagging_longitude");
            fetchAndUpdateTags(latInput, longInput);
        });
    });

    // Event listener for discovery form
    discoveryForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevents the form from submitting

        const formData = new FormData(discoveryForm);
        const params = new URLSearchParams({
            discovery_search: formData.get('discovery_search'),
            discovery_latitude: formData.get('discovery_latitude'),
            discovery_longitude: formData.get('discovery_longitude')
        });

        fetch(`/api/geotags?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            var latInputDiscovery = document.getElementById("discovery_latitude");
            var longInputDiscovery = document.getElementById("discovery_longitude");
            fetchAndUpdateTags(latInputDiscovery, longInputDiscovery);
        });
    });



    updateLocation();
});




