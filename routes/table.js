'use strict'
var express = require('express');
var Table = require('../models/table');
var Match = require('../models/match');

var api = express.Router();
var md_auth = require('../middlewares/jwt');


// ========================
//  Obtener tables
// ========================
api.get('/', (req, res)=>{
    var filter = req.body;
    var from = req.query.from || 0;
    from = Number(from);
    var resulsPerPage = 15;    
    Table.find(filter)
    .populate('owner','name email image')
    // .skip(from)
    // .limit(resulsPerPage)
    .exec(
    (err, tables)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', success: false});
            return;
        }
        else{
            if(tables){
                Table.count({}, (err, totalTables)=>{
                    res.status(200).send({tables, success: true, total: totalTables});
                })
            }                
        }        
    });  
});

api.get('/:id', (req, res)=>{
    var id = req.params.id;    
    Table.findById(id).populate('owner').exec( (err, table)=>{
        if(err){
            res.status(500).send({message: 'Error al obtener el table en el servidor', error: err, success: false});
            return;
        }
        if(table)
            res.status(200).send({table, success: true});
    } );
});

// ========================
//  Añadir tables
// ========================
api.post('/', md_auth.ensureAuth, (req, res)=>{
    var body = req.body;

    var table = new Table({
        chat: body.chat,        
        userslimit: body.userslimit,
        type: body.type,
        betamount: body.betamount,
        totalamount: body.totalamount,
        owner: body.owner,
        name: body.name,
        activeusers: 0,
        closed: false,
        published: false
    });    

    table.save((err, savedTable)=>{
        if(err){
            res.status(400).send({message: 'Error al crear el nuevo table en el servidor', error: err, success: false});
            return;
        }
        else{
            if(savedTable)
                res.status(201).send({table: savedTable, success: true});
        }
    });
    

});

// ========================
//  Actualizar table
// ========================
api.put('/:id',md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    Table.findById(id, (err, table)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el table en el servidor', error: err, success: false});
            return;
        }
        else{
            if(table){
                table.chat = body.chat;                
                table.userslimit = body.userslimit;
                table.type = body.type;
                table.betamount = body.betamount;                
                table.activeusers = body.activeusers;
                table.name = body.name;
                table.published = body.published;
                table.closed = body.closed;
                console.log('CLOSED', body.closed);
                if(body.closed == true){
                    Match.update({}, { $set: {finished: true } }, { multi: false }, (err, match)=>{
                        table.save( (err, table)=>{
                            if(err){
                                res.status(400).send({message: 'Error al actualizar el table en el servidor', error: err, success: false});
                                return;
                            }
                            else{                        
                                if(table)
                                    res.status(201).send({table, success: true});
                            }
                        });     
                    });
                }else{
                    table.save( (err, table)=>{
                        if(err){
                            res.status(400).send({message: 'Error al actualizar el table en el servidor', error: err, success: false});
                            return;
                        }
                        else{                        
                            if(table)
                                res.status(201).send({table, success: true});
                        }
                    });  
                }

                                                                                                                    
            }                
            else{
                res.status(400).send({message: 'Error al actualizar el table en el servidor', error: err, success: false});
                return;
            }
        }
    });   
});

// ========================
//  Eliminar table
// ========================

api.delete('/:id', md_auth.ensureAuth, (req, res)=>{
    var id = req.params.id;    
    Table.findOneAndRemove({ _id: id },(err, deletedTable) =>{
        if(err)
            res.status(500).send({success:false, message: err});
        else{
            if(deletedTable)
                res.status(200).send({success: true, table: deletedTable});
            else    
                console.log('NO EXISTE ESE USUARIO');
        }
    });
});

module.exports = api;