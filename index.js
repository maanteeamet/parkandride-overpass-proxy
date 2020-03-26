'use strict';

const express = require('express');
const request = require("request");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

var url = "https://xgis.maaamet.ee/adsavalik/valjav6te/";

// App
const app = express();
app.get('/', (req, res) => {
  request({
    url: url,
    json: true
  }, function (error, response, body) {
    var item = body.filter(function(i){return i.vvnr == 1 && !("kov" in i);});
    url = url + item[0].fail;
    console.log(url);
    res.redirect(url);
  })
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
