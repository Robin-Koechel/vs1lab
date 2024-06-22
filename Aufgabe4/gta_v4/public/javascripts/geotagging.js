console.log("The geoTagging script is going to start...");

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

function fetchAndUpdateTags(lat, long, taglist) {
    const discoveryResults = document.getElementById('discoveryResults');
    discoveryResults.innerHTML = ''; // Clear previous results

    taglist.forEach(tag => {
        const li = document.createElement('li');
        li.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;
        discoveryResults.appendChild(li);
    });

    var mapManager = new MapManager();
    mapManager.initMap(lat, long);
    mapManager.updateMarkers(lat, long, taglist);
}

function pressTagging(event) {
    event.preventDefault(); // Prevents the form from submitting
    const tagForm = document.getElementById('tag-form');

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
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        const li = document.createElement('li');
        li.textContent = `${data._name} (${data._location.lat}, ${data._location.long}) ${data._hashtag}`;
        discoveryResults.appendChild(li);

    });
}

function pressDiscovery(event) {
    event.preventDefault(); // Prevents the form from submitting

    const discoveryForm = document.getElementById('discoveryFilterForm');

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
        console.log('Success:', data.taglist);

        const discoveryResults = document.getElementById('discoveryResults');
        discoveryResults.innerHTML = ''; // Clear previous results

        data.taglist.forEach(tag => {
            const li = document.createElement('li');
            li.textContent = `${tag._name} (${tag._location.lat}, ${tag._location.long}) ${tag._hashtag}`;
            discoveryResults.appendChild(li);
        });

        var mapManager = new MapManager();
        mapManager.initMap(formData.get('discovery_latitude'), formData.get('discovery_longitude'));
        mapManager.updateMarkers(formData.get('discovery_latitude'), formData.get('discovery_longitude'), data.taglist);

    });
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener('DOMContentLoaded', (event) => {
    const tagForm = document.getElementById('tag-form');
    const discoveryForm = document.getElementById('discoveryFilterForm');

    // Event listener for tagging form
    tagForm.addEventListener('submit', pressTagging);

    // Event listener for discovery form
    discoveryForm.addEventListener('submit', pressDiscovery);

    updateLocation();
});
