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
    constructor(latitude, longitude, name, hashtag) {
        this._location = { lat: latitude, long: longitude }; // Store latitude and longitude in a location object
        this._name = name;
        this._hashtag = hashtag;
    }

    get latitude() {
        return this._location.lat;
    }

    set latitude(latitude) {
        this._location.lat = latitude;
    }

    get longitude() {
        return this._location.long;
    }

    set longitude(longitude) {
        this._location.long = longitude;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get hashtag() {
        return this._hashtag;
    }

    set hashtag(hashtag) {
        this._hashtag = hashtag;
    }

    get location() {
        return this._location;
    }

    set location({ lat, long }) {
        this._location = { lat, long };
    }
}

module.exports = GeoTag;
