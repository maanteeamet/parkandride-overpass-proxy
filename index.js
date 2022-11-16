'use strict';

import express from 'express';
import got from 'got';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


const app = express();

async function fetch_data() {
  return (await got('https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0Aarea(3600079510)-%3E.searchArea%3B%0A(%0A%20%20node%5B%22amenity%22%3D%22parking%22%5D%5B%22park_ride%22%3D%22yes%22%5D(area.searchArea)%3B%0A%20%20way%5B%22amenity%22%3D%22parking%22%5D%5B%22park_ride%22%3D%22yes%22%5D(area.searchArea)%3B%0A%20%20relation%5B%22amenity%22%3D%22parking%22%5D%5B%22park_ride%22%3D%22yes%22%5D(area.searchArea)%3B%0A%20%20node%5B%22amenity%22%3D%22bicycle_parking%22%5D(area.searchArea)%3B%0A%20%20way%5B%22amenity%22%3D%22bicycle_parking%22%5D(area.searchArea)%3B%0A%20%20relation%5B%22amenity%22%3D%22bicycle_parking%22%5D(area.searchArea)%3B%0A)%3B%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B', {responseType: 'json', resolveBodyOnly: true}));
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

