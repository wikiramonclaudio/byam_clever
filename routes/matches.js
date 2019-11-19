'use strict'
var express = require('express');
const https = require('https');
var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener Partidos
// ========================
api.get('/', (req, response)=>{
    var http = require("https");

    var options = {
        "method": "GET",
        "hostname": "heisenbug-la-liga-live-scores-v1.p.rapidapi.com",
        "port": null,
        "path": "/api/laliga?matchday=1",
        "headers": {
            "x-rapidapi-host": "heisenbug-la-liga-live-scores-v1.p.rapidapi.com",
            "x-rapidapi-key": "b916f1b537msh70ca70c76193321p168889jsna6e9495ed0c7"
        }
    };
    var reqst = http.request(options, function (res) {
        var chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            var body = Buffer.concat(chunks);
            response.status(200).send({
                results: chunks
            });
            // console.log(body.toString());
        });
    });
    
    reqst.end();
  
});

api.get('/1', (req, res)=>{
    
    https.get('https://www.scorebat.com/video-api/v1/', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
        res.status(200).send({
            data
        });
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        console.log(JSON.parse(data).explanation);
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
});

api.get('/2', (req, res)=>{
    var http = require("https");

    var options = {
        "method": "GET",
        "hostname": "heisenbug-la-liga-live-scores-v1.p.rapidapi.com",
        "port": null,
        "path": "/api/laliga?matchday=1",
        "headers": {
            "x-rapidapi-host": "heisenbug-la-liga-live-scores-v1.p.rapidapi.com",
            "x-rapidapi-key": "4150dccb2cmsh2643ca11b6f38afp107665jsnd1d6b2e74835"
        }
    };
    
    var req = http.request(options, function (res) {
        var chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });
    
    req.end();
});


module.exports = api;