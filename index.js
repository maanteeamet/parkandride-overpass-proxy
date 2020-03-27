'use strict';

const express = require('express');
const request = require("request");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const overpassQuery = "https://overpass-api.de/api/interpreter?data=%2F%2A%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Cpark_ride%3D%2A%20in%20estonia%E2%80%9D%0A%2A%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20fetch%20area%20%E2%80%9Cestonia%E2%80%9D%20to%20search%20in%0Aarea%283600079510%29-%3E.searchArea%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20%E2%80%9Cpark_ride%3D%2A%E2%80%9D%0A%20%20node%5B%22park_ride%22%3D%22yes%22%5D%28area.searchArea%29%3B%0A%20%20way%5B%22park_ride%22%3D%22yes%22%5D%28area.searchArea%29%3B%0A%20%20relation%5B%22park_ride%22%3D%22yes%22%5D%28area.searchArea%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B";
// App
const app = express();

app.get('/', (req, res) => {
  request.get(overpassQuery).pipe(res);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
