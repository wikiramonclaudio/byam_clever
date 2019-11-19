'use strict'
var express = require('express');
var Bet = require('../models/bet');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener bets
// ========================
api.get('/', (req, res)=>{
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    Bet.find({

    })
    // .populate('user','name email img')
    // .skip(from)
    // .limit(resulsPerPage)
    .exec(
    (err, bets)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', success: false});
            return;
        }
        else{
            if(bets){
                Bet.count({}, (err, totalBets)=>{
                    res.status(200).send({bets, success: true, total: totalBets});
                })
            }                
        }        
    });  
});

api.get('/:id', (req, res)=>{
    var id = req.params.id;    
    Bet.findById(id).exec( (err, bet)=>{
        if(err){
            res.status(500).send({message: 'Error al obtener el bet en el servidor', error: err, success: false});
            return;
        }
        if(bet)
            res.status(200).send({bet, success: true});
    } );
});

api.get('/tablebets/:id', (req, res)=>{
    var id = req.params.id;    
    Bet.find({ table: id}).exec( (err, bet)=>{
        if(err){
            res.status(500).send({message: 'Error al obtener APuestas en el servidor', error: err, success: false});
            return;
        }
        if(bet)
            res.status(200).send({bet, success: true});
    } );
});

// ========================
//  Añadir bets
// ========================
api.post('/', md_auth.ensureAuth, (req, res)=>{
    var body = req.body;
    var bet = new Bet({
        table: body.table,        
        owner: body.owner
    });    

    bet.save((err, savedBet)=>{
        if(err){
            res.status(400).send({message: 'Error al crear el nuevo bet en el servidor', error: err, success: false});
            return;
        }
        else{
            if(savedBet)
                res.status(201).send({bet: savedBet, success: true});
        }        
    });
});

// ========================
//  Actualizar bet
// ========================
api.put('/:id',md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    Bet.findById(id, (err, bet)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el bet en el servidor', error: err, success: false});
            return;
        }
        else{
            if(bet){
                bet.table = body.table;
                bet.owner = body.owner;             
                                                                                         
                bet.save( (err, bet)=>{
                    if(err){
                        res.status(400).send({message: 'Error al actualizar el bet en el servidor', error: err, success: false});
                        return;
                    }
                    else{                        
                        if(bet)
                            res.status(201).send({bet, success: true});
                    }
                });                
            }                
            else{
                res.status(400).send({message: 'Error al actualizar el bet en el servidor', error: err, success: false});
                return;
            }
        }
    });   
});

// ========================
//  Eliminar bet
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;    
    Bet.findOneAndRemove({ _id: id },(err, deletedBet) =>{
        if(err)
            res.status(500).send({success:false, message: err});
        else{
            if(deletedBet)
                res.status(200).send({success: true, bet: deletedBet});
            else    
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;