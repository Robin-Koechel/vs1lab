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

    constructor(latitude, longitude, name, tag){
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.tag = tag;
    }

    get latitude(){
        return this.latitude;
    }

    get longitude(){
        return this.longitude;
    }

    get name(){
        return this.name;
    }

    get tag(){
        return this.tag;
    }

    
}

module.exports = GeoTag;
