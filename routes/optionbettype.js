'use strict'
var express = require('express');
var ObjectBetType = require('../models/optionbettype');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener objectBetTypes
// ========================
api.get('/', (req, res)=>{
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    ObjectBetType.find({

    })
    // .populate('user','name email img')
    // .skip(from)
    // .limit(resulsPerPage)
    .exec(
    (err, objectBetTypes)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', success: false});
            return;
        }
        else{
            if(objectBetTypes){
                ObjectBetType.count({}, (err, totalObjectBetTypes)=>{
                    res.status(200).send({objectBetTypes, success: true, total: totalObjectBetTypes});
                })
            }                
        }        
    });  
});

api.get('/:id', (req, res)=>{
    var id = req.params.id;    
    ObjectBetType.findById(id).populate('owner').exec( (err, objectBetType)=>{
        if(err){
            res.status(500).send({message: 'Error al obtener el objectBetType en el servidor', error: err, success: false});
            return;
        }
        if(objectBetType)
            res.status(200).send({objectBetType, success: true});
    } );
});

// ========================
//  Añadir objectBetTypes
// ========================
api.post('/', md_auth.ensureAuth, (req, res)=>{
    var body = req.body;

    var objectBetType = new ObjectBetType({
        name: body.name,        
        bettype: body.bettype    
    });    

    objectBetType.save((err, savedObjectBetType)=>{
        if(err){
            res.status(400).send({message: 'Error al crear el nuevo objectBetType en el servidor', error: err, success: false});
            return;
        }
        else{
            if(savedObjectBetType)
                res.status(201).send({objectBetType: savedObjectBetType, success: true});
        }
    });
    

});

// ========================
//  Actualizar objectBetType
// ========================
api.put('/:id',md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    ObjectBetType.findById(id, (err, objectBetType)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el objectBetType en el servidor', error: err, success: false});
            return;
        }
        else{
            if(objectBetType){
                objectBetType.name = body.name;                
                objectBetType.bettype = req.bettype;
                                            
                objectBetType.save( (err, objectBetType)=>{
                    if(err){
                        res.status(400).send({message: 'Error al actualizar el objectBetType en el servidor', error: err, success: false});
                        return;
                    }
                    else{                        
                        if(objectBetType)
                            res.status(201).send({objectBetType, success: true});
                    }
                });                
            }                
            else{
                res.status(400).send({message: 'Error al actualizar el objectBetType en el servidor', error: err, success: false});
                return;
            }
        }
    });   
});

// ========================
//  Eliminar objectBetType
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;    
    ObjectBetType.findOneAndRemove({ _id: id },(err, deletedObjectBetType) =>{
        if(err)
            res.status(500).send({success:false, message: err});
        else{
            if(deletedObjectBetType)
                res.status(200).send({success: true, objectBetType: deletedObjectBetType});
            else    
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;