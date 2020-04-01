'use strict';

const express = require('express');
const got = require('got');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


const app = express();

async function fetch_data() {
  return (await got('https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0A*%2F%0A[out%3Ajson][timeout%3A25]%3B%0A%2F%2F%20fetch%20area%20%E2%80%9Cestonia%E2%80%9D%20to%20search%20in%0Aarea(3600079510)-%3E.searchArea%3B%0A%2F%2F%20gather%20results%0A(%0A%0A%20%20%2F%2F%20query%20part%20for%3A%20%E2%80%9Cpark_ride%3D*%E2%80%9D%0A%20%20node[%22amenity%22%3D%22parking%22][%22park_ride%22%3D%22yes%22](area.searchArea)%3B%0A%20%20way[%22amenity%22%3D%22parking%22][%22park_ride%22%3D%22yes%22](area.searchArea)%3B%0A%20%20relation[%22amenity%22%3D%22parking%22][%22park_ride%22%3D%22yes%22](area.searchArea)%3B%0A%0A%20%20%2F%2F%20query%20part%20for%3A%20%E2%80%9C%22bicycle%20parking%22%E2%80%9D%0A%20%20node[%22amenity%22%3D%22bicycle_parking%22](area.searchArea)%3B%0A%20%20way[%22amenity%22%3D%22bicycle_parking%22](area.searchArea)%3B%0A%20%20relation[%22amenity%22%3D%22bicycle_parking%22](area.searchArea)%3B%0A)%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B%0A', {responseType: 'json', resolveBodyOnly: true}));
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

