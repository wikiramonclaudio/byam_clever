'use strict'
var express = require('express');
var Matchbytable = require('../models/matchbytable');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener matchesByTable
// ========================
api.get('/', (req, res)=>{
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    Matchbytable.find({

    })
    // .populate('user','name email img')
    // .skip(from)
    // .limit(resulsPerPage)
    .exec(
    (err, matchesByTable)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', success: false});
            return;
        }
        else{
            if(matchesByTable){
                Matchbytable.count({}, (err, totalMatchbytables)=>{
                    res.status(200).send({matchesByTable, success: true, total: totalMatchbytables});
                })
            }                
        }        
    });  
});


// ========================
//  Obtener matchesByTable by matchesByTable
// ========================
api.get('/:id', (req, res)=>{
    var id = req.params.id;    
    console.log('id table ---> ', id);
    Matchbytable.find({table: id}).populate('match').exec( (err, matchesByTable)=>{
        console.log(matchesByTable);
        if(err){
            res.status(500).send({message: 'Error al obtener el matchesByTable en el servidor', error: err, success: false});
            return;
        }
        if(matchesByTable)
            res.status(200).send({matchesByTable, success: true});
    } );
});

// ========================
//  Añadir matchesByTable
// ========================
api.post('/', md_auth.ensureAuth, (req, res)=>{
    var body = req.body;

    var matchesByTable = new Matchbytable({
        table: body.table,        
        match: body.match,       
    });    

    Matchbytable.find({
        table: body.table,
        match: body.match
    }, (err, subscriptions)=>{
        if(subscriptions.length > 0){
            res.status(400).send({success: false, message: 'Usuario ya registrado en esta mesa'});
        }else{
            matchesByTable.save((err, savedMatchbytable)=>{
                if(err){
                    res.status(400).send({message: 'Error al crear el nuevo matchesByTable en el servidor', error: err, success: false});
                    return;
                }
                else{
                    if(savedMatchbytable)
                        res.status(201).send({matchesByTable: savedMatchbytable, success: true});
                }
            });
        }
    });    
});


//añadir varios 
api.post('/several', md_auth.ensureAuth, (req, res)=>{      

    var payload = req.body;
    (async function(){
        const insertMany = await Matchbytable.insertMany(payload);
        // console.log(JSON.stringify(insertMany,'','\t'));
        res.status(200).send({success: true, matches : payload});
    })();
});


// ========================
//  Actualizar matchesByTable
// ========================
api.put('/:id',md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    Matchbytable.findById(id, (err, matchesByTable)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el matchesByTable en el servidor', error: err, success: false});
            return;
        }
        else{
            if(matchesByTable){
                matchesByTable.name = body.name;
                // matchesByTable.img = body.img;
                matchesByTable.user = req.user._id;
                matchesByTable.save( (err, matchesByTable)=>{
                    if(err){
                        res.status(400).send({message: 'Error al actualizar el matchesByTable en el servidor', error: err, success: false});
                        return;
                    }
                    else{                        
                        if(matchesByTable)
                            res.status(201).send({matchesByTable, success: true});
                    }
                });                
            }                
            else{
                res.status(400).send({message: 'Error al actualizar el matchesByTable en el servidor', error: err, success: false});
                return;
            }
        }
    });   
});

// ========================
//  Eliminar matchesByTable
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;    
    Matchbytable.findOneAndRemove({ _id: id },(err, deletedMatchbytable) =>{
        if(err)
            res.status(500).send({success:false, message: err});
        else{
            if(deletedMatchbytable)
                res.status(200).send({success: true, matchesByTable: deletedMatchbytable});
            else    
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;