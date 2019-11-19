'use strict'
var express = require('express');
var TableSubscription = require('../models/tableSubscription');
var User = require('../models/user');
var Table = require('../models/table');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener tableSubscriptions
// ========================
api.get('/', (req, res) => {
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    TableSubscription.find({

    })
        // .populate('user','name email img')
        // .skip(from)
        // .limit(resulsPerPage)
        .exec(
            (err, tableSubscriptions) => {
                if (err) {
                    res.status(500).send({ message: 'Error en el servidor', success: false });
                    return;
                }
                else {
                    if (tableSubscriptions) {
                        TableSubscription.count({}, (err, totalTableSubscriptions) => {
                            res.status(200).send({ tableSubscriptions, success: true, total: totalTableSubscriptions });
                        })
                    }
                }
            });
});

// ========================
//  Obtener usuarios subscritos a una mesa
// ========================
api.get('/:id', (req, res) => {

    var tableId = req.params.id;
    TableSubscription.find({
        table: tableId
    })
        .populate('player', 'name email image')
        // .populate('table')
        // .skip(from)
        // .limit(resulsPerPage)
        .exec(
            (err, tableSubscriptions) => {
                if (err) {
                    res.status(500).send({ message: 'Error en el servidor', success: false });
                    return;
                }
                else {
                    if (tableSubscriptions) {
                        TableSubscription.count({}, (err, totalTableSubscriptions) => {
                            res.status(200).send({ tableSubscriptions, success: true, total: totalTableSubscriptions });
                        })
                    }
                }
            });
});

// ========================
//  Obtener mesas con un usuario concreto
// ========================
api.get('/user/:id', (req, res) => {

    var id = req.params.id;
    TableSubscription.find({
        player: id
    })
        // .populate('player', 'name email image')
        .populate('table')
         .populate({
            path: 'table',
            populate: {
                path: 'owner'
            }
        })
        // .skip(from)
        // .limit(resulsPerPage)
        .exec(
            (err, tableSubscriptions) => {
                if (err) {
                    res.status(500).send({ message: 'Error en el servidor', success: false });
                    return;
                }
                else {
                    if (tableSubscriptions) {
                        TableSubscription.count({}, (err, totalTableSubscriptions) => {
                            res.status(200).send({ tableSubscriptions, success: true, total: totalTableSubscriptions });
                        })
                    }
                }
            });
});


// ========================
//  Obtener un tableSubscription
// ========================
// api.get('/:id', (req, res)=>{
//     var id = req.params.id;    
//     TableSubscription.findById(id).populate('owner').exec( (err, tableSubscription)=>{
//         if(err){
//             res.status(500).send({message: 'Error al obtener el tableSubscription en el servidor', error: err, success: false});
//             return;
//         }
//         if(tableSubscription)
//             res.status(200).send({tableSubscription, success: true});
//     } );
// });

// ========================
//  Añadir tableSubscriptions
// ========================
api.post('/', md_auth.ensureAuth, (req, res) => {
    var body = req.body;
    var tableSubscription = new TableSubscription({
        player: body.player._id,
        table: body.table._id
    });
    console.log('table es ', body.table._id);
    console.log('player` es ', body.player._id);
    User.findById(body.player, (err, user) => {
        if (user && user.money >= body.table.betamount) {
            TableSubscription.find({
                player: body.player._id,
                table: body.table._id
            }, (err, subscriptions) => {
                console.log('SUSCRPCIONS', subscriptions);
                if (subscriptions.length > 0) {
                    res.status(400).send({ success: false, message: 'Usuario ya registrado en esta mesa' });
                } else {
                    tableSubscription.save((err, savedTableSubscription) => {
                        if (err) {
                            res.status(400).send({ message: 'Error al crear el nuevo tableSubscription en el servidor', error: err, success: false });
                            return;
                        } else {
                            if (savedTableSubscription) {
                                Table.findById(body.table._id, (err, table) => {
                                    if (err) {
                                        res.status(500).send({ message: 'Error al actualizar el table en el servidor', error: err, success: false });
                                        return;
                                    }
                                    if (table) {
                                        table.activeusers = table.activeusers + 1;
                                        table.save((err, table) => {
                                            if (err) {
                                                res.status(400).send({ message: 'Error al actualizar el table en el servidor', error: err, success: false });
                                                return;
                                            }
                                            else {
                                                res.status(201).send({ tableSubscription: savedTableSubscription, success: true });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } else {
            res.status(500).send({ message: 'El usuario no tiene saldo suficiente ', error: err, success: false });
        }

    });



});

// ========================
//  Actualizar tableSubscription
// ========================
api.put('/:id', md_auth.ensureAuth, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    TableSubscription.findById(id, (err, tableSubscription) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el tableSubscription en el servidor', error: err, success: false });
            return;
        }
        else {
            if (tableSubscription) {
                tableSubscription.player = body.player;
                tableSubscription.table = body.table;
                tableSubscription.save((err, tableSubscription) => {
                    if (err) {
                        res.status(400).send({ message: 'Error al actualizar el tableSubscription en el servidor', error: err, success: false });
                        return;
                    }
                    else {
                        if (tableSubscription)
                            res.status(201).send({ tableSubscription, success: true });
                    }
                });
            }
            else {
                res.status(400).send({ message: 'Error al actualizar el tableSubscription en el servidor', error: err, success: false });
                return;
            }
        }
    });
});

// ========================
//  Eliminar tableSubscription
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res) => {
    var id = req.params.id;
    TableSubscription.findOneAndRemove({ _id: id }, (err, deletedTableSubscription) => {
        if (err)
            res.status(500).send({ success: false, message: err });
        else {
            if (deletedTableSubscription)
                res.status(200).send({ success: true, tableSubscription: deletedTableSubscription });
            else
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;