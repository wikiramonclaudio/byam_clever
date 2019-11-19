'use strict'
var express = require('express');
var Match = require('../models/match');
var Matchbytable = require('../models/matchbytable');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener matches (Partidos por jugar)
// ========================
api.get('/', (req, res)=>{
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Match.find(
        {when: {$gte: now}}
    )
    // .populate('user','name email img')
    // .skip(from)
    // .limit(resulsPerPage)
    .exec(
    (err, matches)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', success: false});
            return;
        }
        else{
            if(matches){
                Match.count({}, (err, totalMatches)=>{
                    res.status(200).send({matches, success: true, total: totalMatches});
                })
            }                
        }        
    });  
});

// ========================
//  Obtener matches (Partidos finalizados y empezados)
// ========================
api.get('/finished', (req, res)=>{
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Match.find(
        {when: {$lte: now}}
    )
    // .populate('user','name email img')
    // .skip(from)
    // .limit(resulsPerPage)
    .exec(
    (err, matches)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', success: false});
            return;
        }
        else{
            if(matches){
                Match.count({}, (err, totalMatches)=>{
                    res.status(200).send({matches, success: true, total: totalMatches});
                })
            }                
        }        
    });  
});

api.get('/:id', (req, res)=>{
    var id = req.params.id;    
    Match.findById(id).populate('owner').exec( (err, match)=>{
        if(err){
            res.status(500).send({message: 'Error al obtener el match en el servidor', error: err, success: false});
            return;
        }
        if(match)
            res.status(200).send({match, success: true});
    } );
});

// ========================
//  Añadir matches
// ========================
api.post('/', md_auth.ensureAuth, (req, res)=>{
    var body = req.body;

    var match = new Match({
        tournament: body.tournament,        
        localteam: body.localteam,
        awayteam: body.awayteam,
        when: body.when,
        where: body.where,
        result: null
        // bettype: body.bettype
    });         

    match.save((err, savedMatch)=>{
        if(err){
            res.status(400).send({message: 'Error al crear el nuevo match en el servidor', error: err, success: false});
            return;
        }
        else{
            if(savedMatch)
                res.status(201).send({match: savedMatch, success: true});
        }
    });
    

});


// ========================
//  Actualizar match
// ========================
api.put('/:id',md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    Match.findById(id, (err, match)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el match en el servidor', error: err, success: false});
            return;
        }
        else{
            if(match){
                //RELLENAR TODOS LOS PARAMETROS DE LA CREACIÖN
                match.tournament = body.tournament,        
                match.localteam = body.localteam,
                match.awayteam = body.awayteam,
                match.when = body.when,
                match.where = body.where,
                match.result = body.result;
                // bettype = body.bettype
                match.save( (err, match)=>{
                    if(err){
                        res.status(400).send({message: 'Error al actualizar el match en el servidor', error: err, success: false});
                        return;
                    }
                    else{                        
                        if(match)
                            res.status(201).send({match, success: true});
                    }
                });                
            }                
            else{
                res.status(400).send({message: 'Error al actualizar el match en el servidor', error: err, success: false});
                return;
            }
        }
    });   
});

// ========================
//  Eliminar match
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;    
    Match.findOneAndRemove({ _id: id },(err, deletedMatch) =>{
        if(err)
            res.status(500).send({success:false, message: err});
        else{
            if(deletedMatch)
                res.status(200).send({success: true, match: deletedMatch});
            else    
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;