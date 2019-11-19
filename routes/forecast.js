'use strict'
var express = require('express');
var Forecast = require('../models/forecast');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener forecasts
// ========================
api.get('/', (req, res) => {
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    Forecast.find({

    })
        // .populate('user','name email img')
        // .skip(from)
        // .limit(resulsPerPage)
        .exec(
            (err, forecasts) => {
                if (err) {
                    res.status(500).send({ message: 'Error en el servidor', success: false });
                    return;
                }
                else {
                    if (forecasts) {
                        Forecast.count({}, (err, totalForecasts) => {
                            res.status(200).send({ forecasts, success: true, total: totalForecasts });
                        })
                    }
                }
            });
});

api.get('/:id', (req, res) => {
    var id = req.params.id;
    Forecast.findById(id).populate('owner').exec((err, forecast) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener el forecast en el servidor', error: err, success: false });
            return;
        }
        if (forecast)
            res.status(200).send({ forecast, success: true });
    });
});

// Get forecast by bet
api.get('/betforecasts/:betId', (req, res) => {
    var id = req.params.betId;
    Forecast.find({ bet: id })
        .populate('bettype')
        .populate('match')
        .populate('choice')
        .populate('bet')
        .populate({
            path: 'bettype',
            populate: {
                path: 'option1'
            }
        }).populate({
            path: 'bettype',
            populate: {
                path: 'option2'
            }
        }).populate({
            path: 'bettype',
            populate: {
                path: 'option3'
            }
        }).exec((err, forecast) => {
            if (err) {
                res.status(500).send({ message: 'Error al obtener los forecasts de la apuesta en el servidor', error: err, success: false });
                return;
            }
            if (forecast)
                res.status(200).send({ forecast, success: true });
        });
});

// ========================
//  Añadir forecasts
// ========================
api.post('/', md_auth.ensureAuth, (req, res) => {
    var body = req.body;
    var forecast = new Forecast({
        match: body.match,
        bettype: body.bettype,
        choice: body.choice,
        bet: body.bet
    });

    forecast.save((err, savedForecast) => {
        if (err) {
            res.status(400).send({ message: 'Error al crear el nuevo forecast en el servidor', error: err, success: false });
            return;
        }
        else {
            if (savedForecast)
                res.status(201).send({ forecast: savedForecast, success: true });
        }
    });
});

//añadir varios 
api.post('/several', md_auth.ensureAuth, (req, res) => {
    var payload = req.body;
    (async function () {
        const insertMany = await Forecast.insertMany(payload);
        res.status(200).send({ success: true, forecasts: payload });
    })();
});

// ========================
//  Actualizar forecast
// ========================
api.put('/:id', md_auth.ensureAuth, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Forecast.findById(id, (err, forecast) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el forecast en el servidor', error: err, success: false });
            return;
        }
        else {
            if (forecast) {
                forecast.match = body.match;
                forecast.bettype = body.bettype;
                forecast.choice = body.choice;
                forecast.bet = body.bet;

                forecast.save((err, forecast) => {
                    if (err) {
                        res.status(400).send({ message: 'Error al actualizar el forecast en el servidor', error: err, success: false });
                        return;
                    }
                    else {
                        if (forecast)
                            res.status(201).send({ forecast, success: true });
                    }
                });
            }
            else {
                res.status(400).send({ message: 'Error al actualizar el forecast en el servidor', error: err, success: false });
                return;
            }
        }
    });
});

// ========================
//  Eliminar forecast
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res) => {
    var id = req.params.id;
    Forecast.findOneAndRemove({ _id: id }, (err, deletedForecast) => {
        if (err)
            res.status(500).send({ success: false, message: err });
        else {
            if (deletedForecast)
                res.status(200).send({ success: true, forecast: deletedForecast });
            else
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

// ========================
//  Revisar seleccion ganadora para un partido/check winner choice by match
// ========================
api.put('/checkresult/:id', md_auth.ensureAuth, (req, res) => {
    
    var matchId = req.params.id;    
    var body = req.body;        
    var query = { match: matchId };

    
    Forecast.update(query, { $set: { winnerchoice: body._id, finished: true } }, { multi: true }, (err, results) => {
        if (err)
            return res.status(500).send({ success: false, message: err });
        if (results)
            res.status(200).send({ success: true, forecast: results });

    });


    // {"multi": true},
    // Forecast.update({"match": matchId}, {"$set":{"winnerchoice": body.choice}}, (err, writeResult) => {
    //     if(err)
    //         return res.status(500).send({success:false, message: err}); 
    //     if(writeResult)
    //         res.status(200).send({success: true, forecast: writeResult});

    // })
    // Forecast.updateMany({ 'match': matchId }, { 'winnerchoice': body._id }, (err, writeResult) => {
    //     if (err)
    //         return res.status(500).send({ success: false, message: err });
    //     if (writeResult)
    //         res.status(200).send({ success: true, forecast: writeResult });

    // });

    // Forecast.update({ 'match': matchId }, { winnerchoice: body._id }, { multi: true }, function (err, res) {
    //     if (err)
    //         return res.status(500).send({ success: false, message: err });
    //     if (writeResult)
    //         res.status(200).send({ success: true, forecast: writeResult });
    // });
});

module.exports = api;