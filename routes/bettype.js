'use strict'
var express = require('express');
var BetType = require('../models/betType');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener betTypes
// ========================
api.get('/', (req, res)=>{
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    BetType.find({

    })
    // .populate('user','name email img')
    // .skip(from)
    // .limit(resulsPerPage)
    .exec(
    (err, betTypes)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', success: false});
            return;
        }
        else{
            if(betTypes){
                BetType.count({}, (err, totalBetTypes)=>{
                    res.status(200).send({betTypes, success: true, total: totalBetTypes});
                })
            }                
        }        
    });  
});

api.get('/:id', (req, res)=>{
    var id = req.params.id;    
    BetType.findById(id).populate('owner').exec( (err, betType)=>{
        if(err){
            res.status(500).send({message: 'Error al obtener el betType en el servidor', error: err, success: false});
            return;
        }
        if(betType)
            res.status(200).send({betType, success: true});
    } );
});

// ========================
//  Añadir betTypes
// ========================
api.post('/', md_auth.ensureAuth, (req, res)=>{
    var body = req.body;

    var betType = new BetType({
        chat: body.chat,        
        userslimit: body.userslimit,
        type: body.type,
        betamount: body.betamount,
        totalamount: body.totalamount,
        owner: body.owner,
        name: body.name,
        activeusers: 1,
        closed: false
    });    

    betType.save((err, savedBetType)=>{
        if(err){
            res.status(400).send({message: 'Error al crear el nuevo betType en el servidor', error: err, success: false});
            return;
        }
        else{
            if(savedBetType)
                res.status(201).send({betType: savedBetType, success: true});
        }
    });
    

});

// ========================
//  Actualizar betType
// ========================
api.put('/:id',md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    BetType.findById(id, (err, betType)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el betType en el servidor', error: err, success: false});
            return;
        }
        else{
            if(betType){
                betType.name = body.name;
                betType.option1 = body.option1;
                betType.option2 = body.option2;
                betType.option3 = body.option3;
                                                                                         
                betType.save( (err, betType)=>{
                    if(err){
                        res.status(400).send({message: 'Error al actualizar el betType en el servidor', error: err, success: false});
                        return;
                    }
                    else{                        
                        if(betType)
                            res.status(201).send({betType, success: true});
                    }
                });                
            }                
            else{
                res.status(400).send({message: 'Error al actualizar el betType en el servidor', error: err, success: false});
                return;
            }
        }
    });   
});

// ========================
//  Eliminar betType
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;    
    BetType.findOneAndRemove({ _id: id },(err, deletedBetType) =>{
        if(err)
            res.status(500).send({success:false, message: err});
        else{
            if(deletedBetType)
                res.status(200).send({success: true, betType: deletedBetType});
            else    
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;