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
        this._latitude = latitude; // Use setter methods to set properties
        this._longitude = longitude;
        this._name = name;
        this._hashtag = hashtag;
    }

    get latitude() {
        return this._latitude;
    }

    set latitude(latitude) {
        this._latitude = latitude;
    }

    get longitude() {
        return this._longitude;
    }

    set longitude(longitude) {
        this._longitude = longitude;
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
}

module.exports = GeoTag;

