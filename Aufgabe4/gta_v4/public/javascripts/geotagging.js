console.log("The geoTagging script is going to start...");

var currentPageNumber = 1;
var numberPages = 1;
var taggingPressed = "true";
var mapManager = new MapManager();

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
    taggingPressed = "true";
    const tagForm = document.getElementById('tag-form');

    const formData = new FormData(tagForm);
    const data = {
        latitude: parseFloat(formData.get('tagging_latitude')),
        longitude: parseFloat(formData.get('tagging_longitude')),
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
        .then(response => response.json());

    fetch('/api/geotags?' + new URLSearchParams({ pagenumber: currentPageNumber,taggingPressed:taggingPressed, discovery_search: '', discovery_latitude: formData.get('tagging_latitude'), discovery_longitude: formData.get('tagging_longitude') }), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
        .then(data1 => {
            console.log(data1);
            const dataContainer = document.getElementById('dataContainer');
            dataContainer.setAttribute('data-json', JSON.stringify(data1.taglist));

            const lat = data1.taglist[data1.taglist.length - 1]._location.lat;
            const long = data1.taglist[data1.taglist.length - 1]._location.long;
            const name = data1.taglist[data1.taglist.length - 1]._name;
            numberPages = data1.numberPages;
            mapManager.addMarker(lat, long, name);

            displayCurrentPage();

            // Update the scrolling title with the current page number and total pages
            var scrollingTitle = document.getElementById('scrollPageNumber');
            scrollingTitle.textContent = currentPageNumber + " of " + getNumberPages();
        });
}

function pressDiscovery(event) {
    
    event.preventDefault(); // Prevents the form from submitting
    taggingPressed = "false";

    const discoveryForm = document.getElementById('discoveryFilterForm');

    const formData = new FormData(discoveryForm);
    const d_lat = formData.get('discovery_latitude');
    const d_long = formData.get('discovery_longitude');
    const params = new URLSearchParams({
        pagenumber: '1',
        taggingPressed:taggingPressed,
        discovery_search: formData.get('discovery_search'),
        discovery_latitude: d_lat,
        discovery_longitude: d_long
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

            const dataContainer = document.getElementById('dataContainer');
            console.log(data.taglist);
            var tags = JSON.stringify(data.taglist)
            dataContainer.setAttribute('data-json', tags);


            currentPageNumber = 1;
            console.log(data);
            numberPages = data.numberPages;
            console.log(data.numberPages);
            displayCurrentPage();

            // Update the scrolling title with the current page number and total pages
            const numberPages1 = getNumberPages();
            var scrollingTitle = document.getElementById('scrollPageNumber');
            if (numberPages1 > 0) {
                scrollingTitle.textContent = "1 of " + numberPages1;
            } else {
                scrollingTitle.textContent = "0 of 0";
            }

            const taglist = document.getElementById("dataContainer").getAttribute("data-json");
            const taglistObj = JSON.parse(taglist);
            mapManager.hideMarkers(taglistObj);
        });
}

function displayCurrentPage() {
    const discoveryForm = document.getElementById('discoveryFilterForm');

    const formData = new FormData(discoveryForm);

    const dataContainer = document.getElementById('dataContainer');

    var lat = document.getElementById('tagging_latitude').getAttribute('value');
    var long = document.getElementById('tagging_longitude').getAttribute('value');
    var search = formData.get('discovery_search');


    console.log("lat " + lat);
    console.log("long " + long);
    fetch('/api/geotags?' + new URLSearchParams({
         pagenumber: currentPageNumber,
         taggingPressed:taggingPressed,
         discovery_search: search,
         discovery_latitude: lat,
         discovery_longitude: long
        }), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {

            const discoveryResults = document.getElementById('discoveryResults');
            discoveryResults.innerHTML = ''; // Clear previous results

            console.log(data.taglist);
            data.taglist.forEach(tag => {
                const li = document.createElement('li');
                li.textContent = `${tag._name} (${tag._location.lat}, ${tag._location.long}) ${tag._hashtag}`;
                discoveryResults.appendChild(li);
            });
        });



}

function scrollRight() {
    if (currentPageNumber < getNumberPages()) {
        currentPageNumber++;
        displayCurrentPage();

        // Update the scrolling title with the current page number and total pages
        var scrollingTitle = document.getElementById('scrollPageNumber');
        scrollingTitle.textContent = currentPageNumber + " of " + getNumberPages();
    }
}

function getNumberPages() {

    return numberPages;
}

function scrollLeft() {
    if (currentPageNumber > 1) {
        currentPageNumber--;
        displayCurrentPage();

    }
    // Update the scrolling title with the current page number and total pages
    var scrollingTitle = document.getElementById('scrollPageNumber');
    scrollingTitle.textContent = currentPageNumber + " of " + getNumberPages();

}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener('DOMContentLoaded', (event) => {
    const tagForm = document.getElementById('tag-form');
    const discoveryForm = document.getElementById('discoveryFilterForm');
    const scollRightForm = document.getElementById('scoll_right');
    const scollLeftForm = document.getElementById('scoll_left');

    // Event listener for tagging form
    tagForm.addEventListener('submit', pressTagging);

    // Event listener for discovery form
    discoveryForm.addEventListener('submit', pressDiscovery);

    scollRightForm.addEventListener('click', scrollRight);
    scollLeftForm.addEventListener('click', scrollLeft);

    updateLocation();
});
