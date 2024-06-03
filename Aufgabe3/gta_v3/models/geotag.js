// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    constructor(name, latitude, longitude, hashtag) {
        this.name = name;
        this.location = { lat: latitude, long: longitude };
        this.longitude = longitude;
        this.hashtag = hashtag;
    }
    
    get name() {
        return this.name;
    }

    set name(newName) {
        this.name = newName;
    } 

    get latitude() {
        return this.latitude;
    }

    get longitude() {
        return this.longitude;
    }

    get location() {
        return this.location;
    }

    get hashtag() {
        return this.hashtag;
    }

    set hashtag(newHashtag) {
        this.hashtag = newHashtag;
    }
}

module.exports = GeoTag;
