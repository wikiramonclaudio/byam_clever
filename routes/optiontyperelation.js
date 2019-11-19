'use strict'
var express = require('express');
var OptionTypeRelation = require('../models/optiontyperelation');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener optionsTypeRelation
// ========================
api.get('/', (req, res)=>{
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    OptionTypeRelation.find({

    })
    // .populate('user','name email img')
    // .skip(from)
    // .limit(resulsPerPage)
    .exec(
    (err, optionsTypeRelation)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', success: false});
            return;
        }
        else{
            if(optionsTypeRelation){
                OptionTypeRelation.count({}, (err, totalOptionTypeRelations)=>{
                    res.status(200).send({optionsTypeRelation, success: true, total: totalOptionTypeRelations});
                })
            }                
        }        
    });  
});


// ========================
//  Obtener optionsTypeRelation by betType
// ========================
api.get('/:id', (req, res)=>{
    var id = req.params.id;    
    console.log('id betType ---> ', id);
    OptionTypeRelation.find({bettype: id}).populate('match').exec( (err, optionsTypeRelation)=>{
        console.log(optionsTypeRelation);
        if(err){
            res.status(500).send({message: 'Error al obtener el optionsTypeRelation en el servidor', error: err, success: false});
            return;
        }
        if(optionsTypeRelation)
            res.status(200).send({optionsTypeRelation, success: true});
    } );
});

// ========================
//  Añadir optionsTypeRelation
// ========================
api.post('/', md_auth.ensureAuth, (req, res)=>{
    var body = req.body;    
    var optionsTypeRelation = new OptionTypeRelation({
        bettype: body.bettype,        
        optionbettype: body.optionbettype,       
    });    

    OptionTypeRelation.find({
        bettype: body.bettype,
        optionbettype: body.optionbettype
    }, (err, subscriptions)=>{
        if(subscriptions.length > 0){
            res.status(400).send({success: false, message: 'Usuario ya registrado en esta mesa'});
        }else{
            optionsTypeRelation.save((err, savedOptionTypeRelation)=>{
                if(err){
                    res.status(400).send({message: 'Error al crear el nuevo optionsTypeRelation en el servidor', error: err, success: false});
                    return;
                }
                else{
                    if(savedOptionTypeRelation)
                        res.status(201).send({optionsTypeRelation: savedOptionTypeRelation, success: true});
                }
            });
        }
    });    
});


//añadir varios 
api.post('/several', md_auth.ensureAuth, (req, res)=>{      

    var payload = req.body;
    (async function(){
        const insertMany = await OptionTypeRelation.insertMany(payload);
        // console.log(JSON.stringify(insertMany,'','\t'));
        res.status(200).send({success: true, matches : payload});
    })();
});


// ========================
//  Actualizar optionsTypeRelation
// ========================
api.put('/:id',md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    OptionTypeRelation.findById(id, (err, optionsTypeRelation)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el optionsTypeRelation en el servidor', error: err, success: false});
            return;
        }
        else{
            if(optionsTypeRelation){
                optionsTypeRelation.name = body.name;
                // optionsTypeRelation.img = body.img;
                optionsTypeRelation.user = req.user._id;
                optionsTypeRelation.save( (err, optionsTypeRelation)=>{
                    if(err){
                        res.status(400).send({message: 'Error al actualizar el optionsTypeRelation en el servidor', error: err, success: false});
                        return;
                    }
                    else{                        
                        if(optionsTypeRelation)
                            res.status(201).send({optionsTypeRelation, success: true});
                    }
                });                
            }                
            else{
                res.status(400).send({message: 'Error al actualizar el optionsTypeRelation en el servidor', error: err, success: false});
                return;
            }
        }
    });   
});

// ========================
//  Eliminar optionsTypeRelation
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;    
    OptionTypeRelation.findOneAndRemove({ _id: id },(err, deletedOptionTypeRelation) =>{
        if(err)
            res.status(500).send({success:false, message: err});
        else{
            if(deletedOptionTypeRelation)
                res.status(200).send({success: true, optionsTypeRelation: deletedOptionTypeRelation});
            else    
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;