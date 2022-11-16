'use strict';

const express = require('express');
const got = require('got');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


const app = express();

async function fetch_data() {
  return (await got('https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0Aarea%283600079510%29-%3E.searchArea%3B%0A%28%0A%20%20node%5B%22amenity%22%3D%22parking%22%5D%5B%22park_ride%22%3D%22yes%22%5D%28area.searchArea%29%3B%0A%20%20way%5B%22amenity%22%3D%22parking%22%5D%5B%22park_ride%22%3D%22yes%22%5D%28area.searchArea%29%3B%0A%20%20relation%5B%22amenity%22%3D%22parking%22%5D%5B%22park_ride%22%3D%22yes%22%5D%28area.searchArea%29%3B%0A%20%20node%5B%22amenity%22%3D%22bicycle_parking%22%5D%28area.searchArea%29%3B%0A%20%20way%5B%22amenity%22%3D%22bicycle_parking%22%5D%28area.searchArea%29%3B%0A%20%20relation%5B%22amenity%22%3D%22bicycle_parking%22%5D%28area.searchArea%29%3B%0A%29%3B%0Aconvert%20item%20%3A%3A%3D%3A%3A%2C%3A%3Ageom%3Dgeom%28%29%2C_osm_type%3Dtype%28%29%3B%0Aout%20geom%3B', {responseType: 'json', resolveBodyOnly: true}));
}

function getNow() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

let data;

app.get('/', async (req, res) => {
  console.log(getNow() + ' - Client connected');
  res.send(data);
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  while (!data || !data.elements || !data.elements.length) {
    try {
      console.log("Overpass API status:");
      console.log((await got('https://overpass-api.de/api/status', {resolveBodyOnly: true})));
      console.log("Trying to fetch data...");
      data = await fetch_data();
      if (!data.elements.length) console.log(data.remark);
    } catch(error) {
      console.error(error.response.body);
    }
    await sleep(10000);
  }

  app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
}

main();

