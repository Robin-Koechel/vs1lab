/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore {
    #geotags;
    constructor() {
        // Private array to store geotags
        this.#geotags = [];
    }

    addGeoTag(geoTag) {
        this.#geotags.push(geoTag);
    }

    removeGeoTag(name) {
        this.#geotags = this.#geotags.filter(tag => tag.name !== name);
    }

    getNearbyGeoTags(lat, long, radius){
        return this.#geotags.filter(tag => {
            const distance = Math.sqrt(Math.pow(lat - tag._location.lat, 2) + Math.pow(long - tag._location.long, 2));
            return distance <= radius;
        });
    }

    searchNearbyGeoTags(lat, long, radius, keyword) {
        const nearbyTags = this.getNearbyGeoTags(lat, long, radius);
        return nearbyTags.filter(tag => {
            return tag.name.includes(keyword) || tag.hashtag.includes(keyword);
        });
    }

    getGeoTags(){
        return this.#geotags;
    }

    getTagByID(id) {
        return this.#geotags.filter(tag => tag._id === parseInt(id))[0];
    }

    getNumberEntries(){
        return this.#geotags.length;
    }

}

module.exports = InMemoryGeoTagStore;
