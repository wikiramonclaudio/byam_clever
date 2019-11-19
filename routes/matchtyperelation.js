'use strict'
var express = require('express');
var MatchTypeRelation = require('../models/matchtyperelation');
var OptionBetType = require('../models/optionbettype');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener matchTypeRelation
// ========================
api.get('/', (req, res) => {
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    MatchTypeRelation.find()
        .populate('match')
        .populate('bettype')
        .populate('table')
        .populate({
            path: 'bettype',
            populate: {
                path: 'option1'
            }
        })
        .populate({
            path: 'bettype',
            populate: {
                path: 'option2'
            }
        })
        .populate({
            path: 'bettype',
            populate: {
                path: 'option3'
            }
        })
        // .skip(from)
        // .limit(resulsPerPage)
        .exec(
            (err, matchTypeRelation) => {
                if (err) {
                    res.status(500).send({ message: 'Error en el servidor', success: false });
                    return;
                }
                else {
                    if (matchTypeRelation) {
                        MatchTypeRelation.count({}, (err, totalMatchTypeRelations) => {
                            res.status(200).send({ matchTypeRelation, success: true, total: totalMatchTypeRelations });
                        })
                    }
                }
            });
});


// function getOptionsByBetType(betTypeId) {
//     OptionBetType.find({ bettype: betTypeId })
//         .exec((err, betTypeOptions) => {
//             if (betTypeOptions)
//                 return betTypeOptions;
//         });
// }

// ========================
//  Obtener matchTypeRelation by table
// ========================
api.get('/:id', (req, res) => {
    var id = req.params.id;

    MatchTypeRelation.find({ table: id })
        .populate('match')
        .populate('bettype')
        .populate({
            path: 'bettype',
            populate: {
                path: 'option1'
            }
        })
        .populate({
            path: 'bettype',
            populate: {
                path: 'option2'
            }
        })
        .populate({
            path: 'bettype',
            populate: {
                path: 'option3'
            }
        })
        // .populate('table')
        .exec((err, matchTypeRelation) => {
            if (err) {
                res.status(500).send({ message: 'Error al obtener el matchTypeRelation en el servidor', error: err, success: false });
                return;
            }
            if (matchTypeRelation) {
                // matchTypeRelation.forEach((item) => {
                //     console.log('OPTIONS BY TYPE', getOptionsByBetType(item._id));
                // });
                res.status(200).send({ matchTypeRelation, success: true });
            }
        });
});

// ========================
//  Añadir matchTypeRelation
// ========================
api.post('/', md_auth.ensureAuth, (req, res) => {
    var body = req.body;
    var matchTypeRelation = new MatchTypeRelation({
        bettype: body.bettype,
        optionbettype: body.optionbettype,
    });

    MatchTypeRelation.find({
        bettype: body.bettype,
        optionbettype: body.optionbettype
    }, (err, subscriptions) => {
        if (subscriptions.length > 0) {
            res.status(400).send({ success: false, message: 'Usuario ya registrado en esta mesa' });
        } else {
            matchTypeRelation.save((err, savedMatchTypeRelation) => {
                if (err) {
                    res.status(400).send({ message: 'Error al crear el nuevo matchTypeRelation en el servidor', error: err, success: false });
                    return;
                }
                else {
                    if (savedMatchTypeRelation)
                        res.status(201).send({ matchTypeRelation: savedMatchTypeRelation, success: true });
                }
            });
        }
    });
});


//añadir varios 
api.post('/several', md_auth.ensureAuth, (req, res) => {

    var payload = req.body;
    (async function () {
        const insertMany = await MatchTypeRelation.insertMany(payload);
        // console.log(JSON.stringify(insertMany,'','\t'));
        res.status(200).send({ success: true, matches: payload });
    })();
});


// ========================
//  Actualizar matchTypeRelation
// ========================
api.put('/:id', md_auth.ensureAuth, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    MatchTypeRelation.findById(id, (err, matchTypeRelation) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el matchTypeRelation en el servidor', error: err, success: false });
            return;
        }
        else {
            if (matchTypeRelation) {
                matchTypeRelation.name = body.name;
                // matchTypeRelation.img = body.img;
                matchTypeRelation.user = req.user._id;
                matchTypeRelation.save((err, matchTypeRelation) => {
                    if (err) {
                        res.status(400).send({ message: 'Error al actualizar el matchTypeRelation en el servidor', error: err, success: false });
                        return;
                    }
                    else {
                        if (matchTypeRelation)
                            res.status(201).send({ matchTypeRelation, success: true });
                    }
                });
            }
            else {
                res.status(400).send({ message: 'Error al actualizar el matchTypeRelation en el servidor', error: err, success: false });
                return;
            }
        }
    });
});

// ========================
//  Eliminar matchTypeRelation
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res) => {
    var id = req.params.id;
    MatchTypeRelation.findOneAndRemove({ _id: id }, (err, deletedMatchTypeRelation) => {
        if (err)
            res.status(500).send({ success: false, message: err });
        else {
            if (deletedMatchTypeRelation)
                res.status(200).send({ success: true, matchTypeRelation: deletedMatchTypeRelation });
            else
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;