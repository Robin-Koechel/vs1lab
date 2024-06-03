// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

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
class InMemoryGeoTagStore{

    #store;

    constructor() {
        this.#store = [];
    }


    addGeoTag(tag) {
        this.#store.push(tag);
    }

    removeGeoTag(name) {
        this.#store = this.#store.filter(tag => tag.name !== name);
    }

    getNearbyGeoTags(lat, long, radius) {
        return this.#store.filter(tag => {
            const distance = Math.sqrt(Math.pow(lat - tag.location.latitude, 2) + Math.pow(long - tag.location.longitude, 2));
            return distance <= radius;
        });
    }
    
    searchNearbyGeoTags(lat, long, radius, keyword) {
        const nearbyTags = this.getNearbyGeoTags(lat, long, radius);
        return nearbyTags.filter(tag => {
            return tag.name.includes(keyword) || tag.hashtag.includes(keyword);
        });
    }

    get geotags() {
        return this.#store;
    }
}

module.exports = InMemoryGeoTagStore
