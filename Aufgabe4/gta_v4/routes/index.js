// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

const MapManager = require('../public/javascripts/map-manager')

// App routes (A3)
/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const store = new GeoTagStore();

const GeoTagExamples = require('../models/geotag-examples');
const app = require('../app');
const examples = new GeoTagExamples();
examples.populateStore(store);

router.use(express.json());
/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { 
    taglist: store.getGeoTags(), // Example default coordinates
    currentLatitude: null,
    currentLongitude: null // The position of the user initially
  });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
  const { discovery_search = '', discovery_latitude = 0, discovery_longitude = 0} = req.query;
  let filtered = store.getGeoTags();
  
  if (discovery_search) {
    filtered = filtered.filter(tag => {
      return tag.name.includes(discovery_search) || tag.hashtag.includes(discovery_search);
    });
  }

  if (discovery_latitude && discovery_longitude) {
    filtered = filtered.filter(tag => {
      const distance = Math.sqrt(Math.pow(discovery_latitude - tag.latitude, 2) + Math.pow(discovery_longitude - tag.longitude), 2);
      return distance <= 150;
    });
  }

  res.status(200).send({tagList: filtered});
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
  const { latitude, longitude, name, hashtag } = req.body;
  const geotag = new GeoTag(latitude, longitude, name, hashtag); 
  store.addGeoTag(geotag);

  res.setHeader('Location', `/api/geotags/${geotag.id}`);
  res.status(201).json(geotag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('api/geotags/:id', (req, res) => {
  const { id } = req.params;
  const tag = store.getGeoTags.filter(tag => tag.id === parseInt(id))[0];
  res.status(200).json(tag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, name, hashtag } = req.body;
  const tag = store.getGeoTags.filter(tag => tag.id === parseInt(id))[0];
  tag._location.lat = latitude;
  tag._location.long = longitude;
  tag._name = name;
  tag._hashtag = hashtag;
  res.status(201).json(tag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
  const { id } = req.params;  
  const tag = store.getGeoTags.filter(tag => tag.id === parseInt(id))[0];
  store.removeGeoTag(tag._name);
  res.status(200).json(deleted);
});


module.exports = router;
